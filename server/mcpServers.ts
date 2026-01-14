/**
 * Agent Girl - Modern chat interface for Claude Agent SDK
 * Copyright (C) 2025 KenKai
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import type { ProviderType } from '../client/config/models';

interface McpHttpServerConfig {
  type: 'http';
  url: string;
  headers?: Record<string, string>;
}

interface McpStdioServerConfig {
  type: 'stdio';
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

type McpServerConfig = McpHttpServerConfig | McpStdioServerConfig;

/**
 * MCP servers configuration for different providers
 * - Shared MCP servers (grep.app): Available to all providers
 * - Provider-specific MCP servers: Z.AI has additional web-search and media analysis tools
 */
export const MCP_SERVERS_BY_PROVIDER: Record<ProviderType, Record<string, McpServerConfig>> = {
  'anthropic': {
    // Grep.app MCP - code search across public GitHub repositories
    'grep': {
      type: 'http',
      url: 'https://mcp.grep.app',
    },
    // Supabase MCP - database operations, migrations, Edge Functions
    'supabase': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@supabase/mcp-server-supabase@latest'],
      env: {
        'SUPABASE_ACCESS_TOKEN': process.env.SUPABASE_ACCESS_TOKEN || '',
      },
    },
    // Sequential Thinking MCP - structured problem-solving through step-by-step reasoning
    'sequential-thinking': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    },
  },
  'z-ai': {
    // Grep.app MCP - code search across public GitHub repositories
    'grep': {
      type: 'http',
      url: 'https://mcp.grep.app',
    },
    // GLM models use Z.AI MCP servers
    'web-search-prime': {
      type: 'http',
      url: 'https://api.z.ai/api/mcp/web_search_prime/mcp',
      headers: {
        'Authorization': `Bearer ${process.env.ZAI_API_KEY || ''}`,
      },
    },
    'zai-mcp-server': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@z_ai/mcp-server'],
      env: {
        'Z_AI_API_KEY': process.env.ZAI_API_KEY || '',
        'Z_AI_MODE': 'ZAI',
      },
    },
    // Web Reader MCP - fetches webpage content with structured data extraction
    'web-reader': {
      type: 'http',
      url: 'https://api.z.ai/api/mcp/web_reader/mcp',
      headers: {
        'Authorization': `Bearer ${process.env.ZAI_API_KEY || ''}`,
      },
    },
    // Supabase MCP - database operations, migrations, Edge Functions
    'supabase': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@supabase/mcp-server-supabase@latest'],
      env: {
        'SUPABASE_ACCESS_TOKEN': process.env.SUPABASE_ACCESS_TOKEN || '',
      },
    },
    // Sequential Thinking MCP - structured problem-solving through step-by-step reasoning
    'sequential-thinking': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    },
  },
  'moonshot': {
    // Grep.app MCP - code search across public GitHub repositories
    'grep': {
      type: 'http',
      url: 'https://mcp.grep.app',
    },
    // Supabase MCP - database operations, migrations, Edge Functions
    'supabase': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@supabase/mcp-server-supabase@latest'],
      env: {
        'SUPABASE_ACCESS_TOKEN': process.env.SUPABASE_ACCESS_TOKEN || '',
      },
    },
    // Sequential Thinking MCP - structured problem-solving through step-by-step reasoning
    'sequential-thinking': {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    },
  },
};

/**
 * Get MCP servers for a specific provider
 *
 * @param provider - The provider type
 * @param modelId - Optional model ID for model-specific MCP server restrictions
 */
export function getMcpServers(provider: ProviderType, _modelId?: string): Record<string, McpServerConfig> {
  const servers = MCP_SERVERS_BY_PROVIDER[provider] || {};

  return servers;
}

/**
 * Get allowed tools for a provider's MCP servers
 *
 * @param provider - The provider type
 * @param modelId - Optional model ID for model-specific tool restrictions
 */
export function getAllowedMcpTools(provider: ProviderType, _modelId?: string): string[] {
  // Grep.app MCP tools - available to all providers
  const grepTools = [
    'mcp__grep__searchGitHub',
  ];

  // Supabase MCP tools - available to all providers
  const supabaseTools = [
    'mcp__supabase__search_docs',
    'mcp__supabase__list_organizations',
    'mcp__supabase__get_organization',
    'mcp__supabase__list_projects',
    'mcp__supabase__get_project',
    'mcp__supabase__list_tables',
    'mcp__supabase__list_extensions',
    'mcp__supabase__list_migrations',
    'mcp__supabase__apply_migration',
    'mcp__supabase__execute_sql',
    'mcp__supabase__get_logs',
    'mcp__supabase__get_advisors',
    'mcp__supabase__get_project_url',
    'mcp__supabase__get_publishable_keys',
    'mcp__supabase__generate_typescript_types',
    'mcp__supabase__list_edge_functions',
    'mcp__supabase__get_edge_function',
    'mcp__supabase__deploy_edge_function',
  ];

  // Sequential Thinking MCP tools - available to all providers
  const sequentialThinkingTools = [
    'mcp__sequential-thinking__sequentialthinking_tools',
  ];

  if (provider === 'anthropic') {
    return [
      ...grepTools,
      ...supabaseTools,
      ...sequentialThinkingTools,
    ];
  }

  if (provider === 'z-ai') {
    // All Z.AI/GLM models use the same MCP tools
    return [
      ...grepTools,
      'mcp__web-search-prime__search',
      'mcp__zai-mcp-server__image_analysis',
      'mcp__zai-mcp-server__video_analysis',
      'mcp__web-reader__webReader',
      ...supabaseTools,
      ...sequentialThinkingTools,
    ];
  }

  if (provider === 'moonshot') {
    return [
      ...grepTools,
      ...supabaseTools,
      ...sequentialThinkingTools,
    ];
  }

  return [];
}
