export function generateUniqueSourcesAndTargets(
  numSources: number,
  numTargets: number,
  numRecords: number
) {
  const sources: string[] = [];
  const targets: string[] = [];

  // Generate unique sources
  for (let i = 0; i < numSources; i++) {
    const randomSource = `${Math.floor(Math.random() * 10000) + 1}x1x1`;
    sources.push(randomSource);
  }

  // Generate unique targets
  for (let i = 0; i < numTargets; i++) {
    const randomTarget = `${Math.floor(Math.random() * 10000) + 1}x1x1`;
    targets.push(randomTarget);
  }

  // Build a graph to represent the relationships between sources and targets
  const graph: { [key: string]: string[] } = {};
  for (const target of targets) {
    graph[target] = [];
  }

  const links = [];

  // Generate items while ensuring no circular references
  const orderedTargets = topologicalSort(graph);

  for (const source of sources) {
    for (const target of orderedTargets) {
      const randomValue = Math.floor(Math.random() * 1000000) + 1;

      const newItem = {
        source: `source: ${source}`,
        target: `target: ${target}`,
        value: randomValue,
      };

      links.push(newItem);
      graph[source] = graph[source] || [];
      graph[source].push(target);

      // If the desired number of records is reached, exit the loop early
      if (links.length === numRecords) {
        break;
      }
    }
    // If the desired number of records is reached, exit the loop early
    if (links.length === numRecords) {
      break;
    }
  }

  // Extract unique nodes from links
  const uniqueNodesSet = new Set<string>();
  for (const link of links) {
    uniqueNodesSet.add(link.source);
    uniqueNodesSet.add(link.target);
  }

  const nodes = Array.from(uniqueNodesSet).map(node => ({ name: node }));

  return { links, nodes };
}

// Function to perform topological sorting
function topologicalSort(graph: { [key: string]: string[] }): string[] {
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string) {
    if (visited.has(node)) return;
    visited.add(node);

    const neighbors = graph[node];
    if (neighbors) {
      for (const neighbor of neighbors) {
        dfs(neighbor);
      }
    }

    stack.push(node);
  }

  for (const node of Object.keys(graph)) {
    dfs(node);
  }

  return stack.reverse();
}
