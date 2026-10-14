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
      difficulty: 'Medium',
      question: 'Explain the internal implementation of a HashMap in Java/Kotlin. How does collision resolution work, and what happens when the load factor threshold is exceeded?',
      hint: 'Think about buckets, linked lists vs. red-black trees in Java 8+, and resizing array mechanisms.',
      idealAnswer: 'HashMap uses an array of Node buckets. Hash code determines the bucket index. Collisions are handled via linked lists or transformed into Red-Black Trees when bucket size exceeds 8. Resizing doubles array capacity when size > load factor * capacity.',
      sampleCode: `// Java 8+ HashMap node bucket structure\nstatic class Node<K,V> implements Map.Entry<K,V> {\n    final int hash;\n    final K key;\n    V value;\n    Node<K,V> next;\n}`
    },
    {
      id: 'q_swe_2',
      difficulty: 'Medium',
      question: 'Compare REST APIs vs. gRPC for microservice-to-microservice communication. What are the key architectural trade-offs in terms of latency, serialization, and browser compatibility?',
      hint: 'Mention HTTP/2 multiplexing, Protocol Buffers vs. JSON payloads, and binary serialization.',
      idealAnswer: 'gRPC utilizes HTTP/2 and Protocol Buffers for compact binary serialization, reducing payload size and network latency significantly compared to REST (HTTP/1.1 JSON). REST is universally supported by web browsers, whereas gRPC requires gRPC-Web proxies.',
      sampleCode: null
    },
    {
      id: 'q_swe_3',
      difficulty: 'Hard',
      question: 'How do Database Indexes (B-Trees vs. Hash Indexes vs. LSM Trees) work internally, and what are the trade-offs of creating a composite index?',
      hint: 'Consider read vs. write amplification, left-most prefix rule, and log-structured merge trees in write-heavy databases.',
      idealAnswer: 'B-Trees balance read and write performance with sorted leaf nodes connected in linked lists (O(log N) searches). LSM Trees (used in Cassandra/RocksDB) optimize for high write throughput using in-memory MemTables and append-only SSTables. Composite indexes follow the leftmost prefix rule.',
      sampleCode: null
    },
    {
      id: 'q_swe_4',
      difficulty: 'Medium',
      question: 'What are the four Coffman conditions necessary for a Deadlock to occur in concurrent programming, and how do you prevent them?',
      hint: 'Mutual exclusion, hold and wait, no preemption, and circular wait. Lock ordering breaks circular wait.',
      idealAnswer: 'The 4 conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. You can prevent deadlocks by enforcing strict global lock ordering (eliminating circular wait), using try-lock with timeouts, or adopting lock-free concurrent data structures.',
      sampleCode: null
    },
    {
      id: 'q_swe_5',
      difficulty: 'Hard',
      question: 'Explain how Generational Garbage Collection works in modern runtime environments (e.g. JVM, V8). What causes Stop-The-World pauses and how are they minimized?',
      hint: 'Mention Young generation (Eden, Survivor) vs. Old generation (Tenured) and weak generational hypothesis.',
      idealAnswer: 'Most objects die young (Weak Generational Hypothesis). Memory is split into Young (Eden, Survivor S0/S1) and Old generations. Minor GC rapidly collects Eden via copying. Objects that survive multiple cycles are promoted to Old generation. Collectors like G1 or ZGC run concurrently in regions to avoid long Stop-The-World pauses.',
      sampleCode: null
    },
    {
      id: 'q_swe_6',
      difficulty: 'FAANG Level',
      question: 'How do you handle Distributed Transactions across independent microservices? Compare the 2-Phase Commit (2PC) protocol with the Saga Pattern.',
      hint: 'Think about blocking locks in 2PC vs. compensating transactions in choreography or orchestration Saga.',
      idealAnswer: '2PC provides strong ACID consistency via a Coordinator (Prepare & Commit phases) but causes blocking locks and single point of failure. The Saga pattern provides Eventual Consistency through a sequence of local transactions, triggering Compensating Transactions if any step fails.',
      sampleCode: null
    }
  ],
  sysdesign: [
    {
      id: 'q_sys_1',
      difficulty: 'Hard',
      question: 'Design a distributed rate limiter that can process 100,000 requests per second across multiple global data centers. Which algorithm and caching layer would you choose?',
      hint: 'Consider Token Bucket vs. Sliding Window Log, Redis cluster with Lua scripts, and local in-memory fallback.',
      idealAnswer: 'Use a Sliding Window Counter algorithm backed by Redis Cluster. Implement Redis Lua scripts to atomically execute rate checks and counter increments. Use local memory (e.g. Caffeine Cache) as a graceful fallback during network partitions.',
      sampleCode: `-- Redis Lua script for atomic sliding window counter\nlocal key = KEYS[1]\nlocal limit = tonumber(ARGV[1])\nlocal current = tonumber(redis.call('get', key) or "0")\nif current + 1 > limit then return 0 else redis.call("INCRBY", key, 1) return 1 end`
    },
    {
      id: 'q_sys_2',
      difficulty: 'Medium',
      question: 'Design a URL Shortener service like TinyURL. How do you generate unique short keys, handle 500 million URLs, and optimize read latency?',
      hint: 'Think about Base62 encoding, Key Generation Service (KGS) pre-generating tokens, and Cache-Aside pattern.',
      idealAnswer: 'Use a 7-character Base62 string (62^7 ≈ 3.5 trillion unique keys). Use a dedicated Key Generation Service (KGS) with pre-generated keys stored in DB to avoid runtime collisions and hashing race conditions. Place Redis in front of PostgreSQL using Cache-Aside (LRU policy) for 80/20 read traffic.',
      sampleCode: null
    },
    {
      id: 'q_sys_3',
      difficulty: 'Hard',
      question: 'Design a Distributed Message Broker like Apache Kafka. How do partitions, consumer groups, and offset management guarantee scalability and fault tolerance?',
      hint: 'Mention append-only commit logs, horizontal partition scaling, sequential disk I/O, and zero-copy data transfer.',
      idealAnswer: 'Topics are horizontally partitioned across broker nodes. Each partition is an immutable append-only commit log utilizing sequential disk I/O and OS page cache (Zero-Copy sendfile). Consumer groups allow parallel consumption where each partition is read by one consumer in the group, tracking progress via committed offsets.',
      sampleCode: null
    },
    {
      id: 'q_sys_4',
      difficulty: 'Medium',
      question: 'Design a real-time Notification System that delivers push notifications, SMS, and emails to 50 million active users. How do you prevent duplicate deliveries and handle third-party gateway rate limits?',
      hint: 'Use message queues with idempotency keys, worker pools with token buckets, and priority queues.',
      idealAnswer: 'Decouple notification requests using RabbitMQ or Kafka. Assign every notification an idempotency key stored in Redis/DB to prevent duplicate sends. Use dedicated asynchronous worker pools for APNs, FCM, Twilio, and SendGrid with rate limiters and exponential backoff retry queues.',
      sampleCode: null
    },
    {
      id: 'q_sys_5',
      difficulty: 'FAANG Level',
      question: 'Design a Video Streaming Architecture like YouTube/Netflix. How do you ingest raw video, transcode into adaptive bitrates, and deliver smooth playback globally?',
      hint: 'Mention chunking, HLS/DASH protocols, distributed transcoding workers, and CDN edge caching.',
      idealAnswer: 'Raw video upload goes to Object Storage (S3). Event-driven worker nodes chunk the video and transcode it concurrently into multiple resolutions (1080p, 720p, 480p) using HLS/DASH adaptive bitrate streaming. Chunks and manifest files (.m3u8) are distributed to global CDN edge caches close to users.',
      sampleCode: null
    },
    {
      id: 'q_sys_6',
      difficulty: 'Hard',
      question: 'Explain Cache Invalidation strategies. How do you mitigate the Thundering Herd (Cache Stampede) problem and Cache Penetration in high-traffic applications?',
      hint: 'Mention Cache-Aside vs Write-Through, mutex locking on cache miss, Bloom Filters, and probabilistic early expiration.',
      idealAnswer: 'Thundering Herd occurs when a hot cache key expires and thousands of requests hit DB simultaneously. Mitigate using distributed mutex locking (single thread rebuilds cache) or probabilistic early expiration (XFetch algorithm). For Cache Penetration (queries for non-existent keys), use Bloom Filters or cache null objects with short TTL.',
      sampleCode: null
    }
  ],
  dsa: [
    {
      id: 'q_dsa_1',
      difficulty: 'Easy',
      question: 'Given an array of integers nums and a target value, find two numbers such that they add up to the target. Optimize your solution for O(N) time complexity.',
      hint: 'Can you use a hash table to store complementary values as you iterate through the array?',
      idealAnswer: 'Iterate through the array while maintaining a HashMap of value -> index. For each number, calculate complement = target - num. If complement exists in map, return indices. Time: O(N), Space: O(N).',
      sampleCode: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`
    },
    {
      id: 'q_dsa_2',
      difficulty: 'Medium',
      question: 'Design and implement an LRU (Least Recently Used) Cache with O(1) time complexity for both get() and put() operations.',
      hint: 'Combine a Doubly Linked List for ordering with a Hash Map for O(1) lookups.',
      idealAnswer: 'Use a Doubly Linked List with dummy head and tail nodes to maintain access order, coupled with a HashMap mapping keys to node pointers. On get(), move node to head. On put(), insert at head; if capacity exceeded, remove node from tail.',
      sampleCode: null
    },
    {
      id: 'q_dsa_3',
      difficulty: 'Medium',
      question: 'How do you detect a cycle in a Directed Graph? Explain both DFS (three-color marking) and BFS (Kahn’s Topological Sort algorithm).',
      hint: 'In DFS, cycles occur when hitting a node currently in the recursion stack (grey). In Kahn’s, cycles exist if processed nodes < total vertices.',
      idealAnswer: 'DFS: Mark nodes White (unvisited), Grey (visiting / on stack), Black (fully explored). A cycle is detected if DFS encounters a Grey node. Kahn’s algorithm: Compute in-degrees of all nodes. Repeatedly dequeue 0 in-degree nodes; if total visited < V, a cycle exists.',
      sampleCode: null
    },
    {
      id: 'q_dsa_4',
      difficulty: 'Hard',
      question: 'Merge K sorted linked lists and return it as one sorted list. Analyze the time and space complexity of using a Min-Heap.',
      hint: 'Initialize a Min-Heap with the head of each of the K lists. Heap size is at most K.',
      idealAnswer: 'Push the head node of all K lists into a Min-Heap. Continuously pop the minimum node, append it to the result list, and push its next pointer into the heap. Time: O(N log K) where N is total nodes, Space: O(K) for heap storage.',
      sampleCode: null
    },
    {
      id: 'q_dsa_5',
      difficulty: 'Hard',
      question: 'Explain how to find the Median of Two Sorted Arrays of sizes m and n with an optimal O(log(min(m, n))) time complexity.',
      hint: 'Binary search on the partition of the smaller array so that left half elements <= right half elements.',
      idealAnswer: 'Partition both arrays into left and right halves such that total left elements equal total right elements and max(left) <= min(right). Perform binary search on the partition point of the smaller array. Time: O(log(min(m, n))), Space: O(1).',
      sampleCode: null
    },
    {
      id: 'q_dsa_6',
      difficulty: 'Hard',
      question: 'Explain the Trapping Rain Water problem. How do you solve it in O(N) time and O(1) auxiliary space using two pointers?',
      hint: 'Water trapped at position i is min(left_max, right_max) - height[i]. Move the pointer with the smaller max height inward.',
      idealAnswer: 'Maintain left and right pointers with left_max and right_max. If left_max < right_max, water is bounded by left_max, so add max(0, left_max - height[left]) and advance left. Otherwise, process right. Time: O(N), Space: O(1).',
      sampleCode: null
    }
  ],
  aiml: [
    {
      id: 'q_aiml_1',
      difficulty: 'Hard',
      question: 'Explain the Scaled Dot-Product Attention mechanism in Transformers. Why is the dot product scaled by sqrt(d_k), and what is the computational complexity of Self-Attention?',
      hint: 'Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V. For sequence length N, matrix multiplication is O(N^2).',
      idealAnswer: 'Scaled Dot-Product Attention computes similarities between Query (Q) and Key (K) vectors, applies softmax, and weights Value (V) vectors. Scaling by sqrt(d_k) prevents dot products from growing excessively large in high dimensions, which would cause vanishing gradients in softmax. Time complexity is O(N^2 * d).',
      sampleCode: null
    },
    {
      id: 'q_aiml_2',
      difficulty: 'Medium',
      question: 'What is Retrieval-Augmented Generation (RAG)? Compare naive RAG vs. advanced RAG with hybrid search (dense + sparse) and reranking.',
      hint: 'Naive RAG uses cosine similarity on vector embeddings. Advanced RAG combines BM25 keyword matching with vector search and cross-encoder rerankers.',
      idealAnswer: 'RAG retrieves external domain knowledge to ground LLM generations. Naive RAG suffers from semantic drift and poor keyword precision. Advanced RAG combines dense semantic search (vector embeddings) with sparse keyword search (BM25/SPLADE) via Reciprocal Rank Fusion (RRF), followed by a Cross-Encoder Reranker to filter noise.',
      sampleCode: null
    },
    {
      id: 'q_aiml_3',
      difficulty: 'Medium',
      question: 'Explain parameter-efficient fine-tuning (PEFT) using LoRA (Low-Rank Adaptation). How does decomposing weight matrices into low-rank representations reduce memory footprint?',
      hint: 'W_new = W_0 + B * A where B is (d x r) and A is (r x k) with rank r << min(d, k).',
      idealAnswer: 'Instead of retraining all billions of parameters, LoRA freezes the pre-trained weights W_0 and injects trainable rank-decomposition matrices A and B (delta W = B * A, where rank r is small like 8 or 16). This reduces trainable parameters and optimizer memory by over 90% without losing quality.',
      sampleCode: null
    },
    {
      id: 'q_aiml_4',
      difficulty: 'Hard',
      question: 'How do Approximate Nearest Neighbor (ANN) search algorithms like HNSW (Hierarchical Navigable Small World) work for vector databases?',
      hint: 'Multi-layer graph traversal with skip-list mechanics to achieve logarithmic search time.',
      idealAnswer: 'HNSW constructs a hierarchical multi-layer graph where top layers have sparse, long-range connections for fast coarse routing, and bottom layers have dense local connections for precise search. This transforms brute-force O(N) vector similarity into O(log N) probabilistic search.',
      sampleCode: null
    },
    {
      id: 'q_aiml_5',
      difficulty: 'Medium',
      question: 'How do you detect and mitigate Overfitting in Deep Neural Networks? Explain the mathematical intuition behind Dropout and Weight Decay (L2 Regularization).',
      hint: 'Overfitting: low training loss but high validation loss. Dropout randomly zeroes activations; L2 adds sum of squared weights penalty.',
      idealAnswer: 'Overfitting occurs when a model memorizes training noise. Dropout randomly deactivates neurons during training with probability p, preventing co-adaptation and acting as an ensemble of sub-networks. L2 regularization (Weight Decay) penalizes large weight magnitudes (lambda * ||W||^2), favoring smoother decision boundaries.',
      sampleCode: null
    },
    {
      id: 'q_aiml_6',
      difficulty: 'FAANG Level',
      question: 'Explain key LLM inference optimization techniques: KV Caching, PagedAttention (vLLM), and Model Quantization (INT8 / INT4 AWQ / GPTQ).',
      hint: 'KV caching avoids recomputing past tokens in autoregressive generation. PagedAttention eliminates memory fragmentation.',
      idealAnswer: 'Autoregressive generation generates one token at a time; KV Cache stores previous Keys and Values so past tokens are not re-encoded. PagedAttention manages KV cache memory like virtual memory pages in an OS, reducing fragmentation. Quantization (AWQ/GPTQ) compresses FP16 weights to 4-bit or 8-bit integers with minimal perplexity loss.',
      sampleCode: null
    }
  ],
  pm: [
    {
      id: 'q_pm_1',
      difficulty: 'Hard',
      question: 'Daily Active Users (DAU) dropped by 5% over the past week, but total user engagement time increased by 15%. How do you systematically diagnose and resolve this trade-off?',
      hint: 'Segment users by cohort, platform, geography, and feature usage. Investigate if casual users churned while power users engaged more.',
      idealAnswer: 'Segment the data by demographics, acquisition channel, platform (iOS/Android), and feature cohorts. A drop in DAU alongside an increase in time spent often indicates that casual/marginal users churned (perhaps due to an onboarding roadblock or UI redesign) while power users are spending more time. Verify if revenue or core conversion was harmed before taking corrective steps.',
      sampleCode: null
    },
    {
      id: 'q_pm_2',
      difficulty: 'Medium',
      question: 'How do you prioritize features on a product roadmap using the RICE Framework? How do you balance high-priority customer features against technical debt?',
      hint: 'RICE = (Reach * Impact * Confidence) / Effort. Allocate a fixed capacity (e.g. 20%) for tech debt.',
      idealAnswer: 'Score features across Reach (users impacted per quarter), Impact (scale 1-3), Confidence (0-100% based on research), and Effort (person-months). To manage technical debt, negotiate an ongoing engineering capacity allocation (e.g., 20% of every sprint) tied to stability and latency metrics.',
      sampleCode: null
    },
    {
      id: 'q_pm_3',
      difficulty: 'Hard',
      question: 'You launched a new peer-to-peer mobile payments feature, and the 30-day user retention rate is only 12%. Walk me through your root-cause discovery process.',
      hint: 'Analyze the entire user funnel: discovery -> KYC/linking bank -> sending first payment -> recipient onboarding.',
      idealAnswer: 'Map the complete activation funnel to locate drop-off bottlenecks. Check if recipient friction is high (e.g., recipient must download app to claim funds), if transaction failure rates are elevated, or if notifications are failing. Conduct qualitative user interviews to understand trust barriers.',
      sampleCode: null
    },
    {
      id: 'q_pm_4',
      difficulty: 'Medium',
      question: 'Design an accessible e-commerce grocery delivery mobile application tailored for elderly and visually impaired users.',
      hint: 'Voice navigation, large touch targets, high contrast, screen reader compatibility, and simplified checkout.',
      idealAnswer: 'Prioritize voice-first search and natural speech ordering ("order milk and eggs"). Design high-contrast visual themes with dynamic large typography, minimum 48px touch targets, full VoiceOver/TalkBack compatibility, one-tap reorders, and direct phone support fallback.',
      sampleCode: null
    },
    {
      id: 'q_pm_5',
      difficulty: 'Hard',
      question: 'What is the North Star Metric for Airbnb? How do you break it down into leading input metrics for supply and demand?',
      hint: 'North Star is Nights Booked. Supply input: active host listings; Demand input: search-to-book conversion.',
      idealAnswer: 'Airbnb’s North Star Metric is "Nights Booked". Demand side input metrics: Search volume, listing view-to-inquiry rate, checkout completion rate. Supply side input metrics: New listing sign-ups, host response time, calendar availability, and review satisfaction scores.',
      sampleCode: null
    },
    {
      id: 'q_pm_6',
      difficulty: 'FAANG Level',
      question: 'How would you decide whether to kill an existing, legacy product feature that 5% of your enterprise customers use daily, but costs 30% of engineering maintenance?',
      hint: 'Calculate maintenance cost vs customer churn risk, feature migration path, or grandfathered tiering.',
      idealAnswer: 'Assess the ARR contribution and contract renewal timing of that 5% user base. Build an automated migration path to modern alternatives. Offer a sunset transition timeline (e.g., 6 months notice) or introduce an enterprise premium support add-on to offset maintenance costs.',
      sampleCode: null
    }
  ],
  devops: [
    {
      id: 'q_devops_1',
      difficulty: 'Medium',
      question: 'A production Kubernetes Pod is stuck in a CrashLoopBackOff state. Step-by-step, how do you diagnose and resolve the issue using kubectl?',
      hint: 'kubectl describe pod for events; kubectl logs --previous for exit codes and fatal crash exceptions.',
      idealAnswer: '1) Run `kubectl describe pod <name>` to check Pod events, readiness/liveness probe failures, and OOMKilled signals. 2) Run `kubectl logs <name> --previous` to inspect application crash stack traces before the restart. 3) Verify ConfigMaps, Secrets, environment variables, and memory limits.',
      sampleCode: `kubectl describe pod <pod-name> -n production\nkubectl logs <pod-name> -c <container-name> --previous\nkubectl get events --sort-by=.metadata.creationTimestamp`
    },
    {
      id: 'q_devops_2',
      difficulty: 'Hard',
      question: 'Compare Blue-Green Deployments vs. Canary Releases vs. Rolling Updates. Which strategy would you choose for a zero-downtime database schema migration?',
      hint: 'Database schema changes require backwards-compatible expand-and-contract (parallel run) pattern.',
      idealAnswer: 'Rolling Updates update instances incrementally; Blue-Green switches router traffic instantly between two environments; Canary routes a small percentage (e.g. 5%) of live traffic to test new versions. For DB schema changes, apply the Expand-and-Contract (Parallel Run) pattern: add new column, support both in code, backfill data, and drop old column.',
      sampleCode: null
    },
    {
      id: 'q_devops_3',
      difficulty: 'Hard',
      question: 'How do you detect, prevent, and remediate Terraform State Drift in an enterprise multi-cloud infrastructure setup?',
      hint: 'Use automated CI/CD terraform plan scheduled runs, drift detection tools (Driftctl), and strict IAM permissions.',
      idealAnswer: 'Run scheduled headless `terraform plan -detailed-exitcode` in CI/CD (e.g. nightly) to alert on state differences. Enforce strict cloud IAM boundaries preventing manual console changes. Remediate drift by importing external resources (`terraform import`) or re-applying declared state.',
      sampleCode: null
    },
    {
      id: 'q_devops_4',
      difficulty: 'Medium',
      question: 'Your team’s CI/CD pipeline takes 45 minutes to build, test, and push Docker images. How would you optimize it to complete in under 8 minutes?',
      hint: 'Multi-stage Docker builds, layer caching, BuildKit, test parallelization, and dependency caching.',
      idealAnswer: '1) Enable Docker BuildKit with remote cache (`--cache-from`). 2) Order Dockerfile instructions so rarely changed dependencies (npm install / go mod) are cached before source code. 3) Shard and parallelize unit/integration test suites across multiple CI runners. 4) Cache package manager dependencies (node_modules, pip).',
      sampleCode: null
    },
    {
      id: 'q_devops_5',
      difficulty: 'Hard',
      question: 'Explain AWS VPC architecture: When would you place a resource in a Public vs. Private Subnet, and how do NAT Gateways and Security Groups differ from Network ACLs?',
      hint: 'Public subnets have an IGW route; Private subnets route outbound internet via NAT Gateway. Security Groups are stateful; NACLs are stateless.',
      idealAnswer: 'Public subnets host user-facing load balancers with Internet Gateway (IGW) routes. Databases and application microservices reside in Private subnets with no direct ingress, routing outbound traffic through a NAT Gateway. Security Groups are stateful and operate at the ENI level; Network ACLs are stateless subnet-level packet filters.',
      sampleCode: null
    },
    {
      id: 'q_devops_6',
      difficulty: 'FAANG Level',
      question: 'What are the Three Pillars of Observability (Metrics, Logs, Tracing)? How do you configure OpenTelemetry and distributed tracing to pinpoint microservice latency bottlenecks?',
      hint: 'Metrics quantify symptoms; logs provide context; distributed tracing (W3C Trace Context) tracks requests across async hops.',
      idealAnswer: 'Metrics (Prometheus) provide aggregate health indicators; Logs (Loki/ELK) provide event context; Distributed Tracing (Jaeger/Tempo) tracks request lifecycles across distributed services using a W3C traceparent header. Spans record start/end times and network overhead across RPC calls to identify exact latency bottlenecks.',
      sampleCode: null
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
