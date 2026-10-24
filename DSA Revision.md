# Data Structures and Algorithm Concepts — Revision Sheet

## 1. Complexity Cheat Sheet

- O(1): constant time
- O(log n): halving or splitting search space
- O(n): single pass through data
- O(n log n): efficient sorting and divide-and-conquer
- O(n^2): nested loops, naive pair checks
- O(2^n): exponential search with state explosion

### Quick rules
- Prefer logarithmic or linear work for large input
- Repeated states often indicate DP or memoization
- Graphs with many connections usually need adjacency lists
- If a problem has constraints like 10^5 or 10^6, avoid quadratic work

## 2. Trees

### Important properties
- A tree is hierarchical and connected
- A binary tree has at most two children per node
- Traversal types:
  - preorder: node, left, right
  - inorder: left, node, right
  - postorder: left, right, node
  - level order: breadth-first

### Binary Search Tree
- left subtree < node
- right subtree > node
- search, insert, delete: O(h)
- worst case: O(n) if tree is skewed

### Balanced trees
- keep height near logarithmic
- important for predictable search and insert performance

### Heap
- min-heap: smallest element at root
- max-heap: largest element at root
- insert and extract: O(log n)
- top element: O(1)

## 3. Graphs

### Representation
- adjacency list: best for sparse graphs
- adjacency matrix: best for dense graphs

### Traversals
- BFS: shortest path in unweighted graphs
- DFS: connectivity, cycles, backtracking, topological order

### Important graph problems
- connected components
- cycle detection
- bipartite check
- shortest path
- topological ordering
- MST

### Shortest path
- BFS: unweighted graph
- Dijkstra: non-negative weights
- Bellman-Ford: handles negative edges

## 4. Hashing and Maps

### Core idea
Hashing gives near-constant-time lookup, insertion, and deletion on average.

### Common uses
- frequency counting
- membership tests
- deduplication
- dictionary-like lookup

### Trade-offs
- average case: O(1)
- worst case: O(n) when collisions are severe
- good hashing matters for performance

## 5. Strings and Pattern Matching

### Must-know techniques
- substring search
- palindrome checks
- anagram checks
- longest common subsequence
- longest common prefix
- prefix/suffix logic

### Efficient pattern matching
- KMP: prefix-based matching
- Z algorithm: efficient prefix matching
- Rabin-Karp: rolling hash approach

### Trie
- stores strings by character path
- great for prefix searches and dictionary operations

## 6. Sorting

### Stable sorts
- merge sort
- insertion sort in certain cases

### Fast general sorts
- merge sort: O(n log n), stable
- quick sort: average O(n log n), worst O(n^2)
- heap sort: O(n log n), in-place

### Specialized sorts
- counting sort: good when range is small
- radix sort: good for integers or fixed-length keys

### When to choose a sort
- need stability? choose merge sort
- need speed in practice? quick sort often wins
- need guaranteed worst-case bounds? heap sort or merge sort

## 7. Search

### Binary search
- valid when data is sorted or the predicate is monotonic
- runtime: O(log n)

### Common forms
- find exact value
- find first valid position
- lower bound / upper bound
- search in rotated sorted data with a monotonic condition

## 8. Recursion and Divide and Conquer

### Recursion checklist
- base case
- recursion on smaller subproblem
- state progression toward termination

### Memoization
- cache subproblem results
- avoids duplicated work

### Divide and conquer
- split the problem
- solve smaller parts
- merge results

### Examples
- merge sort
- quick sort
- tree traversal
- many optimization problems

## 9. Dynamic Programming

### Core idea
Solve overlapping subproblems once and reuse the answer.

### Typical states
- index position
- remaining capacity
- current row/column
- last chosen item

### Common patterns
- 0/1 knapsack
- unbounded knapsack
- longest increasing subsequence
- longest common subsequence
- coin change
- edit distance

### Top-down vs bottom-up
- top-down: memoized recursion
- bottom-up: iterative DP table

## 10. Greedy Algorithms

### Main idea
Take the locally best move when the problem has the right structure.

### Good candidates
- interval scheduling
- activity selection
- canonical coin systems
- optimal prefix decisions under exchange arguments

### Rule of thumb
Greedy is correct only when the structure of the problem guarantees it. Always ask: "Does choosing the current best option preserve the global optimum?"

## 11. Backtracking

### Core idea
Build a solution incrementally and backtrack when a branch cannot work.

### Typical problems
- permutations
- combinations
- subset generation
- N-Queens
- Sudoku-like constraints

### Performance key
Use pruning aggressively to avoid exploring dead branches.

## 12. Union-Find

### Purpose
Track connected groups efficiently.

### Operations
- find parent
- union two components

### Common uses
- graph connectivity
- cycle detection
- Kruskal's algorithm for MST

### Key optimization
- path compression
- union by rank or size

## 13. Bit Manipulation

### Important operations
- XOR
- AND
- OR
- shifts
- masking
- toggling bits

### Common interview uses
- parity
- power-of-two checks
- set/unset bits
- subset enumeration
- integer optimization

## 14. Advanced Structures

### Segment Tree
- supports range query and point update
- O(log n)

### Fenwick Tree
- compact prefix-sum structure
- O(log n) for updates and queries

### Trie
- efficient for string prefix and dictionary operations

## 15. Interview Strategy

### Before coding
- clarify the problem
- identify the core operation: search, count, optimize, validate, reconstruct
- think about constraints
- choose the appropriate structure or pattern

### While explaining your idea
- state the approach clearly
- mention why it works
- describe the complexity
- check edge cases

### Always test
- empty input
- single element
- duplicates
- sorted and unsorted data
- maximum or minimum values
- cyclic or contradictory cases

## 16. Final Revision Checklist

Before an interview, confirm you can explain:
- complexity analysis
- tree traversal and BST behavior
- graph traversal and shortest path logic
- hashing, map usage, and collisions
- sorting complexity and trade-offs
- recursion and DP state design
- greedy correctness conditions
- backtracking with pruning
- union-find for connectivity
- bit manipulation patterns

If you can explain the reason behind each approach and the complexity, you are in a strong interview position.
