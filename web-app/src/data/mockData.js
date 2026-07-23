export const ROLES = [
  { id: 'swe', name: 'Software Engineer', icon: 'Code', desc: 'Core CS fundamentals, OOP, APIs, and data structures.' },
  { id: 'sysdesign', name: 'System Design Architect', icon: 'Network', desc: 'Distributed systems, scalability, databases, and microservices.' },
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: 'Cpu', desc: 'Arrays, Trees, Graphs, Dynamic Programming, and Big-O analysis.' },
  { id: 'aiml', name: 'AI / ML Engineer', icon: 'BrainCircuit', desc: 'LLMs, PyTorch, Model Optimization, RAG, and Computer Vision.' },
  { id: 'pm', name: 'Product Manager', icon: 'Users', desc: 'Product strategy, execution, system trade-offs, and behavioral scenarios.' },
  { id: 'devops', name: 'DevOps & Cloud Engineer', icon: 'Cloud', desc: 'Kubernetes, CI/CD, Terraform, AWS architecture, and reliability.' }
];

export const AI_PERSONAS = [
  {
    id: 'architect',
    name: 'Alex Vance (Strict Architect)',
    title: 'Principal Staff Architect @ FAANG',
    avatarBg: '#3B82F6',
    accentColor: '#60A5FA',
    voicePitch: 0.9,
    description: 'Direct, highly technical, drills deep into edge cases, latency, and system trade-offs.'
  },
  {
    id: 'mentor',
    name: 'Dr. Sarah Chen (Encouraging Mentor)',
    title: 'Engineering Director @ AI Research',
    avatarBg: '#8B5CF6',
    accentColor: '#C084FC',
    voicePitch: 1.1,
    description: 'Supportive and constructive. Guides you with subtle hints when you get stuck.'
  },
  {
    id: 'lead',
    name: 'Marcus Brody (Technical Lead)',
    title: 'Senior Tech Lead @ Enterprise Unicorn',
    avatarBg: '#10B981',
    accentColor: '#34D399',
    voicePitch: 1.0,
    description: 'Pragmatic, focuses on clean code, maintainability, production readiness, and communication.'
  }
];

export const INTERVIEW_QUESTIONS = {
  swe: [
    {
      id: 'q_swe_1',
      question: 'Explain the internal implementation of a HashMap in Java/Kotlin. How does collision resolution work, and what happens when the load factor threshold is exceeded?',
      hint: 'Think about buckets, linked lists vs. red-black trees in Java 8+, and resizing array mechanisms.',
      idealAnswer: 'HashMap uses an array of Node buckets. Hash code determines the bucket index. Collisions are handled via linked lists or transformed into Red-Black Trees when bucket size exceeds 8. Resizing doubles array capacity when size > load factor * capacity.',
      sampleCode: `// Java 8+ HashMap node bucket structure
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}`
    },
    {
      id: 'q_swe_2',
      question: 'Compare REST APIs vs. gRPC for microservice-to-microservice communication. What are the key architectural trade-offs in terms of latency, serialization, and browser compatibility?',
      hint: 'Mention HTTP/2 multiplexing, Protocol Buffers vs. JSON payloads, and binary serialization.',
      idealAnswer: 'gRPC utilizes HTTP/2 and Protocol Buffers for compact binary serialization, reducing payload size and network latency significantly compared to REST (HTTP/1.1 JSON). REST is universally supported by web browsers, whereas gRPC requires gRPC-Web proxies.',
      sampleCode: null
    }
  ],
  sysdesign: [
    {
      id: 'q_sys_1',
      question: 'Design a distributed rate limiter that can process 100,000 requests per second across multiple global data centers. Which algorithm and caching layer would you choose?',
      hint: 'Consider Token Bucket vs. Sliding Window Log, Redis cluster with Lua scripts, and local in-memory fallback.',
      idealAnswer: 'Use a Sliding Window Counter algorithm backed by Redis Cluster. Implement Redis Lua scripts to atomically execute rate checks and counter increments. Use local memory (e.g. Caffeine Cache) as a graceful fallback during network partitions.',
      sampleCode: `-- Redis Lua script for atomic sliding window counter
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")
if current + 1 > limit then
    return 0
else
    redis.call("INCRBY", key, 1)
    return 1
end`
    }
  ],
  dsa: [
    {
      id: 'q_dsa_1',
      question: 'Given an array of integers nums and a target value, find two numbers such that they add up to the target. Optimize your solution for O(N) time complexity.',
      hint: 'Can you use a hash table to store complementary values as you iterate through the array?',
      idealAnswer: 'Iterate through the array while maintaining a HashMap of value -> index. For each number, calculate complement = target - num. If complement exists in map, return indices. Time: O(N), Space: O(N).',
      sampleCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
    }
  ]
};

export const FLASHCARDS = [
  {
    id: 'fc_1',
    topic: 'System Design',
    company: 'Google',
    difficulty: 'Hard',
    question: 'What is CAP Theorem and why is CA practically impossible in distributed systems?',
    answer: 'CAP Theorem states a distributed system can only provide two of: Consistency, Availability, Partition Tolerance. Network partitions (P) are unavoidable in distributed physical networks, so systems must trade off Consistency (CP) vs. Availability (AP).'
  },
  {
    id: 'fc_2',
    topic: 'Data Structures',
    company: 'Amazon',
    difficulty: 'Medium',
    question: 'What is the time and space complexity of QuickSort in average vs. worst case?',
    answer: 'Average Case: O(N log N) time, O(log N) space. Worst Case: O(N^2) time when array is already sorted and pivot choice is naive (first/last element).'
  },
  {
    id: 'fc_3',
    topic: 'Concurrency',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'Explain the difference between Mutex, Semaphore, and Read-Write Lock.',
    answer: 'Mutex: Mutual exclusion lock (single owner). Semaphore: Allows up to N concurrent threads access. Read-Write Lock: Allows unlimited concurrent readers OR one exclusive writer.'
  },
  {
    id: 'fc_4',
    topic: 'AI / ML',
    company: 'Microsoft',
    difficulty: 'Medium',
    question: 'What is Retrieval-Augmented Generation (RAG) and how does it prevent LLM hallucinations?',
    answer: 'RAG retrieves relevant external domain documents using vector embeddings and appends them to the LLM prompt context, grounding responses in factual data.'
  }
];

export const CODING_PROBLEMS = [
  {
    id: 'code_1',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees & DFS',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST guarantees left node values < root < right node values.',
    starterCode: {
      python: `def isValidBST(root):\n    # Write your solution here\n    pass`,
      javascript: `function isValidBST(root) {\n    // Write your solution here\n    return true;\n}`,
      java: `public boolean isValidBST(TreeNode root) {\n    // Write your solution here\n    return true;\n}`
    },
    testCases: [
      { input: 'root = [2,1,3]', expected: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', expected: 'false' }
    ]
  }
];

export const RECENT_SCORES = [
  { id: 1, title: 'System Design Mock Interview', date: 'Yesterday', score: 88, status: 'Passed', topic: 'Distributed Caching' },
  { id: 2, title: 'FAANG Data Structures Practice', date: '3 days ago', score: 94, status: 'Passed', topic: 'Trees & Graphs' },
  { id: 3, title: 'Behavioral & Leadership Drills', date: '5 days ago', score: 79, status: 'Needs Work', topic: 'Conflict Resolution' }
];
