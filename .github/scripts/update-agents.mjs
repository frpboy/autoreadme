#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

/**
 * Parse commit message to determine if it's significant
 * Significant commits include: feat, fix, refactor, perf, docs (for major docs)
 */
function isSignificantCommit(message, files) {
  const lowerMsg = message.toLowerCase();
  
  // Check conventional commit types
  const significantTypes = ['feat:', 'feature:', 'fix:', 'refactor:', 'perf:', 'breaking:'];
  const isSignificant = significantTypes.some(type => lowerMsg.startsWith(type));
  
  // Check if it's a major documentation change (not just typos)
  const isMajorDocs = lowerMsg.startsWith('docs:') && (
    lowerMsg.includes('add') || 
    lowerMsg.includes('create') || 
    lowerMsg.includes('implement')
  );
  
  // Check if significant files were changed
  const significantFiles = files.some(f => 
    f.includes('src/') || 
    f.includes('package.json') || 
    f.includes('.github/workflows/')
  );
  
  return (isSignificant || isMajorDocs) && significantFiles;
}

/**
 * Get commit details
 */
function getCommitDetails(commitHash) {
  try {
    const subject = execSync(`git log -1 --format=%s ${commitHash}`, { encoding: 'utf8' }).trim();
    const body = execSync(`git log -1 --format=%b ${commitHash}`, { encoding: 'utf8' }).trim();
    const author = execSync(`git log -1 --format=%an ${commitHash}`, { encoding: 'utf8' }).trim();
    const date = execSync(`git log -1 --format=%ad --date=short ${commitHash}`, { encoding: 'utf8' }).trim();
    const files = execSync(`git diff-tree --no-commit-id --name-only -r ${commitHash}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
    
    return { subject, body, author, date, files, hash: commitHash.substring(0, 7) };
  } catch (error) {
    console.error('Error getting commit details:', error.message);
    return null;
  }
}

/**
 * Categorize commit based on message
 */
function categorizeCommit(message) {
  const lower = message.toLowerCase();
  
  if (lower.startsWith('feat:') || lower.startsWith('feature:')) return 'feature';
  if (lower.startsWith('fix:')) return 'fix';
  if (lower.startsWith('refactor:')) return 'refactor';
  if (lower.startsWith('perf:')) return 'performance';
  if (lower.startsWith('docs:')) return 'documentation';
  if (lower.includes('breaking') || lower.startsWith('breaking:')) return 'breaking';
  
  return 'other';
}

/**
 * Extract key changes from commit body and files
 */
function extractKeyChanges(commit) {
  const changes = [];
  const { subject, body, files } = commit;
  
  // Parse body for bullet points or key changes
  if (body) {
    const lines = body.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
    });
    
    lines.forEach(line => {
      const cleaned = line.trim().replace(/^[-*•]\s*/, '');
      if (cleaned && !cleaned.toLowerCase().includes('co-authored-by')) {
        changes.push(cleaned);
      }
    });
  }
  
  // If no bullet points in body, infer from files changed
  if (changes.length === 0) {
    const srcFiles = files.filter(f => f.startsWith('src/'));
    if (srcFiles.length > 0) {
      changes.push(`Modified: ${srcFiles.map(f => `\`${f}\``).join(', ')}`);
    }
    
    const workflowFiles = files.filter(f => f.includes('.github/workflows/'));
    if (workflowFiles.length > 0) {
      changes.push(`Updated GitHub Actions workflow`);
    }
    
    const templateFiles = files.filter(f => f.includes('templates/'));
    if (templateFiles.length > 0) {
      changes.push(`Modified templates: ${templateFiles.map(f => f.split('/').pop()).join(', ')}`);
    }
  }
  
  return changes;
}

/**
 * Format commit entry for AGENTS.md
 */
function formatCommitEntry(commit) {
  const category = categorizeCommit(commit.subject);
  const changes = extractKeyChanges(commit);
  
  let entry = `#### ${commit.subject} (${commit.date})\n`;
  entry += `**Commit:** \`${commit.hash}\`\n\n`;
  
  if (category === 'breaking') {
    entry += `⚠️ **BREAKING CHANGE**\n\n`;
  }
  
  if (changes.length > 0) {
    entry += `**Changes:**\n`;
    changes.forEach(change => {
      entry += `- ${change}\n`;
    });
  } else {
    // Fallback to just the subject
    entry += `**Changes:**\n`;
    entry += `- ${commit.subject.split(':').slice(1).join(':').trim()}\n`;
  }
  
  entry += `\n`;
  return entry;
}

/**
 * Get the current month/year section header
 */
function getCurrentSection() {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return `### ${month}`;
}

/**
 * Update AGENTS.md with new commit
 */
function updateAgentsFile(commitHash) {
  const agentsPath = 'AGENTS.md';
  
  if (!existsSync(agentsPath)) {
    console.log('AGENTS.md not found, skipping update');
    return false;
  }
  
  const commit = getCommitDetails(commitHash);
  if (!commit) {
    console.log('Could not retrieve commit details');
    return false;
  }
  
  // Check if this is a significant commit
  if (!isSignificantCommit(commit.subject, commit.files)) {
    console.log(`Skipping non-significant commit: ${commit.subject}`);
    return false;
  }
  
  // Skip if this is the AGENTS.md update commit itself
  if (commit.subject.toLowerCase().includes('update agents.md') || 
      commit.subject.toLowerCase().includes('update changelog')) {
    console.log('Skipping automated AGENTS.md update commit');
    return false;
  }
  
  let content = readFileSync(agentsPath, 'utf8');
  
  // Find or create the current month section
  const currentSection = getCurrentSection();
  const sectionRegex = new RegExp(`^${currentSection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm');
  
  const entry = formatCommitEntry(commit);
  
  if (sectionRegex.test(content)) {
    // Section exists, add entry after the section header
    content = content.replace(
      sectionRegex,
      `${currentSection}\n\n${entry}`
    );
  } else {
    // Create new section under "## Recent Changes"
    const recentChangesPos = content.indexOf('## Recent Changes');
    if (recentChangesPos !== -1) {
      // Find the end of "## Recent Changes" line
      const lineEnd = content.indexOf('\n', recentChangesPos);
      // Insert new section
      content = 
        content.substring(0, lineEnd + 1) +
        `\n${currentSection}\n\n${entry}` +
        content.substring(lineEnd + 1);
    } else {
      console.error('Could not find "## Recent Changes" section');
      return false;
    }
  }
  
  // Update the "Last Updated" timestamp at the bottom
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(
    /\*\*Last Updated:\*\* \d{4}-\d{2}-\d{2}/,
    `**Last Updated:** ${today}`
  );
  
  writeFileSync(agentsPath, content, 'utf8');
  console.log(`✅ Updated AGENTS.md with commit ${commit.hash}`);
  return true;
}

// Main execution
const commitHash = process.argv[2] || process.env.GITHUB_SHA || 'HEAD';
console.log(`Processing commit: ${commitHash}`);

const updated = updateAgentsFile(commitHash);
process.exit(updated ? 0 : 1);
