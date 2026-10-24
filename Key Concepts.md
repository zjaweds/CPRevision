# Data Structures and Algorithm Concepts — Revision Sheet

This sheet is for quick recall: each topic includes the central idea, a small visual, and a cue for when to use it. For full C# examples and more patterns, see the linked guides at the end.

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

### How to picture growth

```text
input size n:       10       100       1,000
O(1):                1         1           1
O(log n):          ~3.3       ~6.6        ~10
O(n):                10       100       1,000
O(n log n):         ~33       ~664      ~9,966
O(n²):              100    10,000   1,000,000
```

This is growth, not a runtime promise: machine speed and constant factors matter too. Count how often the central operation runs, and include memory used by maps, queues, tables, and recursion.

## 2. Trees

### Important properties
- A tree is hierarchical and connected
- A binary tree has at most two children per node
- Traversal types:
  - preorder: node, left, right
  - inorder: left, node, right
  - postorder: left, right, node
  - level order: breadth-first

```text
         A                  preorder:  A B D E C
       /   \                inorder:   D B E A C
      B     C               postorder: D E B C A
     / \
    D   E                   level order: A B C D E
```

DFS follows a branch before returning; BFS processes one depth at a time. A recursive DFS usually uses O(h) call-stack space; BFS can use O(w) queue space, where h is height and w is maximum width.

### Binary Search Tree
- left subtree < node
- right subtree > node
- search, insert, delete: O(h)
- worst case: O(n) if tree is skewed

The ordering rule lets each comparison discard one subtree. A sorted insertion sequence can create a chain:

```text
balanced:       skewed:
    4               1
   / \               \
  2   6               2
                     \
                      3
```

Here h is the number of levels (conventionally edges or nodes, stated consistently). Balanced trees keep h = O(log n); an unbalanced BST can have h = O(n).

### Balanced trees
- keep height near logarithmic
- important for predictable search and insert performance

An AVL tree uses subtree heights and rotates after insertion/deletion when the child heights differ by more than one. LL/RR imbalances need one rotation; LR/RL need a child rotation followed by a parent rotation. Red-black trees use coloring invariants and rotations for looser but still logarithmic balance.

```text
LL:   z        right rotation       y
     /                              / \
    y          ------------>       x   z
   /
  x
```

The RR case mirrors this and uses a left rotation. LR and RL first rotate the child, then rotate the unbalanced node.

### Heap
- min-heap: smallest element at root
- max-heap: largest element at root
- insert and extract: O(log n)
- top element: O(1)

```text
Array: [1, 3, 2, 8, 5]       Min-heap:
             1
           /   \
          3     2
         / \
        8   5
```

Only parent-child order is guaranteed; the array is not fully sorted. Bottom-up heapify starts at the last parent and sifts down to build a heap in O(n); inserting n values separately costs O(n log n). In C#, `PriorityQueue<TElement, TPriority>` is a min-priority queue in .NET 6+.

## 3. Graphs

### Representation
- adjacency list: best for sparse graphs
- adjacency matrix: best for dense graphs

```text
A -- B                 adjacency list: A:[B], B:[A,C], C:[B]
     |                 matrix stores one cell for every vertex pair
     C
```

An adjacency list stores edges and costs O(V+E); a matrix stores all possible pairs and costs O(V²). Choose based on density and whether neighbor iteration or constant-time edge checks are more common.

### Traversals
- BFS: shortest path in unweighted graphs
- DFS: connectivity, cycles, backtracking, topological order

BFS uses a queue and discovers nodes in distance layers; mark a node visited when enqueuing it. DFS uses a stack or recursion to explore deeply before backtracking. Both take O(V+E) with adjacency lists.

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

```text
Equal edge cost?       -> BFS
Non-negative weights?  -> Dijkstra + min-priority queue
Negative edges allowed?-> Bellman-Ford; check negative cycles
```

“Shortest” must be defined: fewest edges, minimum total weight, or another metric. Dijkstra is not correct with negative weights.

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

```text
key -> hash -> bucket
                 ├─ chaining: bucket holds multiple entries
                 └─ probing: search another slot after collision
```

A dictionary/set trades extra memory for fast expected membership and lookup. Keys must have stable equality/hash behavior while stored; collisions can degrade worst-case lookup to O(n).

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

```text
car, cart, cat:
root -> c -> a -> r* -> t*
                  \
                   t*
* = full word; shared path = shared prefix
```

KMP reuses prefix information after mismatch; Z stores prefix-match lengths; Rabin-Karp rolls a hash across windows and verifies collisions. A trie walks one edge per character, so lookup is O(L) for a word of length L.

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

```text
Merge sort: split -> sort halves -> merge
Quick sort: choose pivot -> partition -> sort sides
Heap sort:  build heap -> repeatedly remove root
```

Comparison sorts have an Ω(n log n) lower bound in the general case. Counting/radix/bucket sorts can do better only by exploiting key range, digit representation, or data distribution.

## 7. Search

### Binary search
- valid when data is sorted or the predicate is monotonic
- runtime: O(log n)

### Common forms
- find exact value
- find first valid position
- lower bound / upper bound
- search in rotated sorted data with a monotonic condition

Maintain an interval that still contains the answer. A lower bound finds the first index with value >= target; an upper bound finds the first index with value > target. Binary search on the answer works when feasibility is monotonic:

```text
capacity:  1  2  3  4  5  6  7
feasible:  F  F  F  T  T  T  T
                         ^
find first true ---------|
```

## 8. Recursion and Divide and Conquer

### Recursion checklist
- base case
- recursion on smaller subproblem
- state progression toward termination

### Memoization
- cache subproblem results
- avoids duplicated work

```text
Naive Fibonacci:           Memoized:
       fib(5)                 fib(5)
      /     \                 /   \
   fib(4)  fib(3)          fib(4) cached fib(3)
    ...      ...             ...
same states repeat         each state once
```

Memoization helps when recursive branches request the same state. The cache key must include every input that can change the answer.

### Divide and conquer
- split the problem
- solve smaller parts
- merge results

### Examples
- merge sort
- quick sort
- tree traversal
- many optimization problems

The calls are arranged like a tree:

```text
                 problem n
               /          \
          problem n/2   problem n/2
             / \            / \
          smaller ...    smaller ...
```

Each level's work plus the number of levels determines the recurrence. For merge sort, `T(n)=2T(n/2)+O(n)`, yielding O(n log n).

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

```text
Top-down: ask for answer -> recursively request dependencies -> cache
Bottom-up: fill base states -> fill dependent states -> read final answer
```

Before coding, define `dp[state]` in one sentence, base cases, transition, and iteration order. For 0/1 knapsack, capacity is traversed downward so an item is not reused; for unbounded knapsack it is usually traversed upward.

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

For interval scheduling, choosing the interval that ends earliest leaves the most room for future work. A proof often swaps the first choice of an arbitrary optimal solution with the greedy choice and shows the result is no worse.

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

```text
                 choice
                /      \
           valid       invalid -> prune
           /   \
       choices ...      ...
```

Always undo a choice after returning from recursion. Pruning improves typical search but does not automatically remove exponential worst-case complexity.

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

```text
Before find:  root -> A -> B -> C
After find:   root -> A, B, C
```

`Find` follows parent links to a representative; path compression shortens the path for later operations. Union by size/rank attaches the smaller tree below the larger.

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

For bit k, `mask & (1 << k)` checks it; OR sets it; XOR toggles it; AND with the inverted mask clears it. `x & (x - 1)` clears the lowest set bit. A bitmask can represent a subset, but enumerating 2ⁿ masks remains exponential.

```text
bit index:  3 2 1 0
mask:       0 1 0 1  -> items 2 and 0 selected
```

## 14. Advanced Structures

### Segment Tree
- supports range query and point update
- O(log n)

### Fenwick Tree
- compact prefix-sum structure
- O(log n) for updates and queries

### Trie
- efficient for string prefix and dictionary operations

### Choosing between Fenwick and segment tree
- Fenwick: smaller and simpler for prefix sums/frequency updates.
- Segment tree: more flexible for min/max/custom associative range queries and some range-update schemes.
- Both support point update and range query in O(log n).

```text
values:    [2, 1, 3, 4]
segment:       [10]
             /      \
           [3]      [7]
          /  \      /  \
         2    1    3    4
```

The root summarizes the full range; leaves represent individual values. A query combines only the nodes covering its requested interval. A Fenwick tree stores overlapping prefix ranges more compactly and is usually the simpler choice for sums/frequencies.

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

### Explain the solution in one minute

```text
Input clue -> pattern -> invariant -> algorithm -> complexity -> edge cases
```

Example: “The array is sorted and asks for a pair sum, so I use two pointers. If the sum is too small, moving left is the only move that can increase it; if too large, move right. Each pointer moves at most n times: O(n) time and O(1) extra space.”

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

For detailed pattern recognition, C# examples, and diagrams, see the [DSA Problem Patterns in C#](./DSA_Problem_Patterns_CSharp.md) guide.
