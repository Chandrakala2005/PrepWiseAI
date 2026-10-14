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
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptance: '53.6%',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      python: `def twoSum(nums, target):\n    # Time: O(n), Space: O(n) using a hash map\n    prev_map = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prev_map:\n            return [prev_map[diff], i]\n        prev_map[n] = i\n    return []`,
      javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            return [map.get(diff), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      java: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int diff = target - nums[i];\n        if (map.containsKey(diff)) {\n            return new int[] { map.get(diff), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[0];\n}`
    },
    hints: [
      'A brute force O(n^2) check checks every pair.',
      'Can you use a Hash Table to look up the complement in O(1) time?'
    ],
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0,1]' }
    ]
  },
  {
    id: 'code_2',
    number: 206,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    acceptance: '76.8%',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: {
      python: `def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
      javascript: `function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      java: `public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`
    },
    hints: [
      'Maintain three pointers: prev, curr, and next.',
      'Reverse the pointer direction at each step: curr.next = prev.'
    ],
    testCases: [
      { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', expected: '[2,1]' },
      { input: 'head = []', expected: '[]' }
    ]
  },
  {
    id: 'code_3',
    number: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays & Greedy',
    acceptance: '54.5%',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.',
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    starterCode: {
      python: `def maxProfit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        min_price = min(min_price, p)\n        max_profit = max(max_profit, p - min_price)\n    return max_profit`,
      javascript: `function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (const p of prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}`,
      java: `public int maxProfit(int[] prices) {\n    int minPrice = Integer.MAX_VALUE;\n    int maxProfit = 0;\n    for (int p : prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}`
    },
    hints: [
      'Track the minimum price seen so far as you iterate through the days.',
      'Calculate potential profit at each step: current_price - min_price.'
    ],
    testCases: [
      { input: 'prices = [7,1,5,3,6,4]', expected: '5' },
      { input: 'prices = [7,6,4,3,1]', expected: '0' }
    ]
  },
  {
    id: 'code_4',
    number: 125,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers & Strings',
    acceptance: '48.2%',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    starterCode: {
      python: `def isPalindrome(s: str) -> bool:\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l, r = l + 1, r - 1\n    return True`,
      javascript: `function isPalindrome(s) {\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return clean === clean.split('').reverse().join('');\n}`,
      java: `public boolean isPalindrome(String s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n        l++; r--;\n    }\n    return true;\n}`
    },
    hints: [
      'Two pointers moving towards each other can solve this in O(n) time and O(1) extra space.',
      'Skip non-alphanumeric characters using pointers.'
    ],
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expected: 'true' },
      { input: 's = "race a car"', expected: 'false' },
      { input: 's = " "', expected: 'true' }
    ]
  },
  {
    id: 'code_5',
    number: 98,
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees & DFS',
    acceptance: '33.1%',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST guarantees that the left subtree of a node contains only nodes with keys strictly less than the node key, and the right subtree contains only keys strictly greater than the node key.',
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1'
    ],
    starterCode: {
      python: `def isValidBST(root):\n    def validate(node, low=-float('inf'), high=float('inf')):\n        if not node: return True\n        if not (low < node.val < high): return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root)`,
      javascript: `function isValidBST(root) {\n    function validate(node, min = -Infinity, max = Infinity) {\n        if (!node) return true;\n        if (node.val <= min || node.val >= max) return false;\n        return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n    }\n    return validate(root);\n}`,
      java: `public boolean isValidBST(TreeNode root) {\n    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}\nprivate boolean validate(TreeNode node, long min, long max) {\n    if (node == null) return true;\n    if (node.val <= min || node.val >= max) return false;\n    return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n}`
    },
    hints: [
      'It is not sufficient that left.val < root.val. All nodes in the left subtree must be less than root.',
      'Pass down valid ranges (low, high) during recursive DFS traversal.'
    ],
    testCases: [
      { input: 'root = [2,1,3]', expected: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', expected: 'false' }
    ]
  },
  {
    id: 'code_6',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    acceptance: '35.4%',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    l = 0\n    res = 0\n    for r in range(len(s)):\n        while s[r] in char_set:\n            char_set.remove(s[l])\n            l += 1\n        char_set.add(s[r])\n        res = max(res, r - l + 1)\n    return res`,
      javascript: `function lengthOfLongestSubstring(s) {\n    const set = new Set();\n    let l = 0, res = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) {\n            set.delete(s[l]);\n            l++;\n        }\n        set.add(s[r]);\n        res = Math.max(res, r - l + 1);\n    }\n    return res;\n}`,
      java: `public int lengthOfLongestSubstring(String s) {\n    Set<Character> set = new HashSet<>();\n    int l = 0, res = 0;\n    for (int r = 0; r < s.length(); r++) {\n        while (set.contains(s.charAt(r))) {\n            set.remove(s.charAt(l++));\n        }\n        set.add(s.charAt(r));\n        res = Math.max(res, r - l + 1);\n    }\n    return res;\n}`
    },
    hints: [
      'Use the Sliding Window technique with left and right pointers.',
      'Use a HashSet to store visited characters in the current window.'
    ],
    testCases: [
      { input: 's = "abcabcbb"', expected: '3' },
      { input: 's = "bbbbb"', expected: '1' },
      { input: 's = "pwwkew"', expected: '3' }
    ]
  },
  {
    id: 'code_7',
    number: 322,
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '44.8%',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    starterCode: {
      python: `def coinChange(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let a = 1; a <= amount; a++) {\n        for (const c of coins) {\n            if (a - c >= 0) {\n                dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n            }\n        }\n    }\n    return dp[amount] !== Infinity ? dp[amount] : -1;\n}`,
      java: `public int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++) {\n        for (int c : coins) {\n            if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`
    },
    hints: [
      'This is an unbounded knapsack problem. Think bottom-up DP.',
      'dp[i] represents the minimum coins needed to make amount i.'
    ],
    testCases: [
      { input: 'coins = [1,2,5], amount = 11', expected: '3' },
      { input: 'coins = [2], amount = 3', expected: '-1' },
      { input: 'coins = [1], amount = 0', expected: '0' }
    ]
  },
  {
    id: 'code_8',
    number: 56,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals & Sorting',
    acceptance: '47.5%',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4'
    ],
    starterCode: {
      python: `def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.append(current)\n    return merged`,
      javascript: `function merge(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const prev = res[res.length - 1];\n        const curr = intervals[i];\n        if (curr[0] <= prev[1]) {\n            prev[1] = Math.max(prev[1], curr[1]);\n        } else {\n            res.push(curr);\n        }\n    }\n    return res;\n}`,
      java: `public int[][] merge(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n    List<int[]> res = new ArrayList<>();\n    int[] curr = intervals[0];\n    res.add(curr);\n    for (int[] interval : intervals) {\n        if (interval[0] <= curr[1]) {\n            curr[1] = Math.max(curr[1], interval[1]);\n        } else {\n            curr = interval;\n            res.add(curr);\n        }\n    }\n    return res.toArray(new int[res.size()][]);\n}`
    },
    hints: [
      'Sorting intervals by start time turns the problem into a single pass.',
      'Overlap exists when curr.start <= prev.end.'
    ],
    testCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', expected: '[[1,5]]' }
    ]
  },
  {
    id: 'code_9',
    number: 215,
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'Heap & Quickselect',
    acceptance: '67.2%',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Can you solve it in O(n) average time complexity without sorting the entire array?',
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    starterCode: {
      python: `import heapq\ndef findKthLargest(nums, k):\n    # Min-heap of size k -> O(n log k)\n    return heapq.nlargest(k, nums)[-1]`,
      javascript: `function findKthLargest(nums, k) {\n    nums.sort((a, b) => b - a);\n    return nums[k - 1];\n}`,
      java: `public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int n : nums) {\n        minHeap.offer(n);\n        if (minHeap.size() > k) minHeap.poll();\n    }\n    return minHeap.peek();\n}`
    },
    hints: [
      'A Min-Heap of size k keeps the k largest elements.',
      'Alternatively, Quickselect gives O(n) average runtime.'
    ],
    testCases: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', expected: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', expected: '4' }
    ]
  },
  {
    id: 'code_10',
    number: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers & Stack',
    acceptance: '62.4%',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterCode: {
      python: `def trap(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water`,
      javascript: `function trap(height) {\n    let l = 0, r = height.length - 1;\n    let leftMax = 0, rightMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= leftMax) leftMax = height[l];\n            else water += leftMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rightMax) rightMax = height[r];\n            else water += rightMax - height[r];\n            r--;\n        }\n    }\n    return water;\n}`,
      java: `public int trap(int[] height) {\n    int l = 0, r = height.length - 1;\n    int leftMax = 0, rightMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= leftMax) leftMax = height[l];\n            else water += leftMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rightMax) rightMax = height[r];\n            else water += rightMax - height[r];\n            r--;\n        }\n    }\n    return water;\n}`
    },
    hints: [
      'Water trapped above bar i is min(max_left, max_right) - height[i].',
      'Two pointers moving inward eliminate the need for O(n) auxiliary arrays.'
    ],
    testCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
      { input: 'height = [4,2,0,3,2,5]', expected: '9' }
    ]
  }
];

export const RECENT_SCORES = [
  { id: 1, title: 'System Design Mock Interview', date: 'Yesterday', score: 88, status: 'Passed', topic: 'Distributed Caching' },
  { id: 2, title: 'FAANG Data Structures Practice', date: '3 days ago', score: 94, status: 'Passed', topic: 'Trees & Graphs' },
  { id: 3, title: 'Behavioral & Leadership Drills', date: '5 days ago', score: 79, status: 'Needs Work', topic: 'Conflict Resolution' }
];
