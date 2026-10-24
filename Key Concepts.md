# Data Structures and Algorithm Concepts — In-Depth Study

This guide focuses on the concepts that most often matter in technical interviews and problem solving: reasoning, trade-offs, patterns, and implementation quality. It emphasizes depth over memorization.

## 1. Complexity Analysis

### Why it matters
Every problem has hidden costs. Interviewers care less about whether your code passes one case and more about whether it scales under large input sizes.

### Big-O, Big-Theta, Big-Omega
- Big-O: asymptotic upper bound (often used to state worst-case growth)
- Big-Theta: tight growth estimate
- Big-Omega: lower bound

### Common complexity patterns
- O(1): constant work
- O(log n): divide-and-conquer, binary search over sorted data, balanced tree operations
- O(n): single pass over data
- O(n log n): typical efficient sorting and many divide-and-conquer algorithms
- O(n^2): nested loops, naive dynamic programming transitions, simple graph scans
- O(2^n), O(n!): exponential search spaces, often solve via pruning or DP

### Space complexity
Space usage includes:
- input storage
- recursion stack
- auxiliary structures like maps, sets, DP tables, visited states

### Practical interview rule
When constraints are large, prefer:
- logarithmic or linear-time scans
- memoization to avoid repeated work
- iterative logic when recursion depth may explode

### How to derive a complexity
Count how many times the central work runs as input size `n` grows. A single pass is O(n); two independent nested loops are usually O(n²); repeatedly halving a search range is O(log n). Include auxiliary data and recursion depth in space complexity, and distinguish worst-case from average-case.

```csharp
static bool ContainsPairWithSum(int[] values, int target)
{
    var seen = new HashSet<int>();
    foreach (int value in values)
    {
        if (seen.Contains(target - value)) return true;
        seen.Add(value);
    }
    return false;
}
```
This runs in expected O(n) time and O(n) extra space. Comparing each pair without a set takes O(n²) time but O(1) extra space. Big-O is an asymptotic upper bound, Big-Omega a lower bound, and Big-Theta a tight bound; none alone specifies whether the case is average or worst-case.

## 2. Trees

### Core idea
A tree is a hierarchical structure where each node has a parent and possibly children.

### Terminology
- root
- parent/child
- leaf
- depth and height
- subtree
- balanced versus unbalanced tree

### Why trees are important
Trees help model hierarchical data, search spaces, and efficient indexing.

### Binary tree properties
- Each node has at most two children.
- Height can be used to reason about performance.
- In a complete tree, the number of nodes at a given depth is predictable.

### Tree traversals
#### Depth-first traversal
- preorder: node, left, right
- inorder: left, node, right
- postorder: left, right, node

Use cases:
- preorder: construct tree from root-first data
- inorder: recover sorted order in a binary search tree
- postorder: process children before parent

#### Breadth-first traversal
- level order
- useful for shortest path in unweighted graphs and level-based processing

In a recursive traversal, the base case is an empty node. Preorder is useful when the parent must be processed before its descendants; postorder is useful when a parent’s result depends on computed child results. Level order uses a queue and visits nodes by depth:

```csharp
static List<int> LevelOrder(TreeNode? root)
{
    var result = new List<int>();
    if (root is null) return result;
    var queue = new Queue<TreeNode>();
    queue.Enqueue(root);
    while (queue.Count > 0)
    {
        TreeNode node = queue.Dequeue();
        result.Add(node.Value);
        if (node.Left is not null) queue.Enqueue(node.Left);
        if (node.Right is not null) queue.Enqueue(node.Right);
    }
    return result;
}
```
All traversals visit each node once: O(n) time and O(h) recursion space for DFS (worst-case O(n)), or O(w) queue space for BFS, where w is maximum tree width.

### Binary Search Trees
A BST maintains invariant:
- left subtree values < node
- right subtree values > node

Operations:
- search: O(h)
- insert: O(h)
- delete: O(h)

Worst-case height is O(n), so balanced trees matter.

BST deletion has three cases: remove a leaf directly; replace a node with its only child; or, with two children, copy the inorder successor (smallest key in the right subtree) and delete that successor. The ordering invariant is preserved in each case.

### Balanced tree variants
- AVL tree
- Red-black tree
- B-tree and B+ tree in databases and file systems

Purpose:
- keep height logarithmic for efficient operations
- maintain predictable performance under frequent insertions and deletions

An **AVL tree** stores each node’s height and requires its balance factor `height(left) - height(right)` to stay in {-1, 0, 1}. After insertion, heights are updated toward the root. A balance factor of +2 or -2 is repaired by rotation:

- LL: right-rotate the unbalanced node.
- RR: left-rotate it.
- LR: left-rotate its left child, then right-rotate the node.
- RL: right-rotate its right child, then left-rotate the node.

```csharp
static int Height(AvlNode? node) => node?.Height ?? 0;
static void UpdateHeight(AvlNode node) =>
    node.Height = 1 + Math.Max(Height(node.Left), Height(node.Right));

static AvlNode RotateRight(AvlNode y)
{
    AvlNode x = y.Left!;
    AvlNode? middle = x.Right;
    x.Right = y;
    y.Left = middle;
    UpdateHeight(y);
    UpdateHeight(x);
    return x;
}

static AvlNode RotateLeft(AvlNode x)
{
    AvlNode y = x.Right!;
    AvlNode? middle = y.Left;
    y.Left = x;
    x.Right = middle;
    UpdateHeight(x);
    UpdateHeight(y);
    return y;
}
```
`update_height(node)` must set `1 + max(height(node.left), height(node.right))`; rebalance code tests the balance factor and performs a single or double rotation as listed. For example, inserting 30, 20, 10 causes LL imbalance at 30; a right rotation makes 20 the subtree root. AVL lookup and insertion are O(log n). Full insertion code with all four cases is in 17.2.

A **red-black tree** allows looser balance than AVL but enforces a black root, no red node with a red child, and equal black-node counts on every root-to-leaf path. Insert/delete fix violations by recoloring and rotating; these constraints guarantee O(log n) height. A **B-tree** stores several keys per node; when a node fills, it splits and promotes a median key. A **B+ tree** keeps records in linked leaves and routing keys in internal nodes, making ordered range scans efficient. Their high branching factor reduces storage-page reads.

### Heap properties
A heap is a specialized tree-based structure that satisfies heap order:
- min-heap: parent <= children
- max-heap: parent >= children

Use cases:
- priority scheduling
- top-k problems
- merging streams
- greedy selection logic

Time complexity:
- extract min/max: O(log n)
- insert: O(log n)
- peek: O(1)

An array-backed binary heap keeps parent/child positions implicit: children of index `i` are `2*i+1` and `2*i+2`. Insert appends and sifts up; extraction swaps the root with the last item and sifts down.

**Heapify** builds a valid heap from an existing array. Start at the last internal node (`n / 2 - 1`) and sift each node down toward the root. This bottom-up process is O(n), not O(n log n): most nodes are near the leaves and move only a short distance. Inserting n values individually is O(n log n). The `Heapify` method below demonstrates the bottom-up algorithm; .NET's `PriorityQueue<TElement, TPriority>` is also available for standard priority-queue operations.

```csharp
// Bottom-up heapify is O(n); repeated insertion is O(n log n).
static class MinHeap
{
    public static int[] Heapify(int[] values)
    {
        int[] heap = (int[])values.Clone();
        for (int i = heap.Length / 2 - 1; i >= 0; i--)
            SiftDown(heap, i, heap.Length);
        return heap;
    }

    public static int[] BuildByRepeatedInsert(int[] values)
    {
        int[] heap = new int[values.Length];
        for (int i = 0; i < values.Length; i++)
        {
            heap[i] = values[i];
            SiftUp(heap, i);
        }
        return heap;
    }

    private static void SiftUp(int[] heap, int i)
    {
        while (i > 0)
        {
            int parent = (i - 1) / 2;
            if (heap[parent] <= heap[i]) return;
            (heap[parent], heap[i]) = (heap[i], heap[parent]);
            i = parent;
        }
    }

    private static void SiftDown(int[] heap, int i, int count)
    {
        while (true)
        {
            int smallest = i, left = 2 * i + 1, right = left + 1;
            if (left < count && heap[left] < heap[smallest]) smallest = left;
            if (right < count && heap[right] < heap[smallest]) smallest = right;
            if (smallest == i) return;
            (heap[i], heap[smallest]) = (heap[smallest], heap[i]);
            i = smallest;
        }
    }

    public static void Main()
    {
        int[] heap = Heapify(new[] { 5, 2, 8, 1 });
        Console.WriteLine(heap[0]); // 1: minimum is at the root
        // BuildByRepeatedInsert(new[] { 5, 2, 8, 1 }) gives the same heap property,
        // but takes O(n log n) instead of Heapify's O(n).
    }
}
```
### Extended runnable tree examples
The full AVL insertion implementation (height maintenance, duplicate-key behavior, and LL/RR/LR/RL dispatch), plus full traversal and heap examples, is in Section 17.2–17.3.

### Tree interview traps
- Confusing tree height with number of nodes
- Forgetting to base recursion on subtree boundaries
- Not handling null or empty child cases
- Assuming BST property without verifying it in the current problem context

## 3. Graphs

### Core idea
Graphs model relationships among entities.

### Graph representations
- adjacency list: efficient for sparse graphs
- adjacency matrix: useful for dense graphs or matrix-based patterns

An adjacency list stores one neighbor collection per vertex and takes O(V+E) space (for an undirected graph, each edge appears twice). An adjacency matrix stores whether each pair is connected, takes O(V²) space, and checks an edge in O(1). Use the list when scanning neighbors; use the matrix when the graph is dense or edge lookup dominates.

### Common graph traversals
#### BFS
- explores level by level
- best for shortest path in unweighted graphs
- uses a queue-like process conceptually

#### DFS
- explores as deep as possible before backtracking
- useful for connectivity, cycles, articulation points, topological sort, path existence

BFS marks a vertex when it is enqueued, ensuring it is queued once and first discovered at minimum edge distance. DFS uses a stack (or recursion) to follow a branch before backtracking. Both take O(V+E) time and O(V) auxiliary space for a complete traversal.

```csharp
static Dictionary<string, int> BfsDistances(
    Dictionary<string, List<string>> graph, string start)
{
    var distance = new Dictionary<string, int> { [start] = 0 };
    var queue = new Queue<string>();
    queue.Enqueue(start);
    while (queue.Count > 0)
    {
        string node = queue.Dequeue();
        if (!graph.TryGetValue(node, out var neighbors)) continue;
        foreach (string next in neighbors)
            if (!distance.ContainsKey(next))
            {
                distance[next] = distance[node] + 1;
                queue.Enqueue(next);
            }
    }
    return distance;
}

static List<string> Dfs(Dictionary<string, List<string>> graph, string start)
{
    var visited = new HashSet<string>();
    var order = new List<string>();
    var stack = new Stack<string>();
    stack.Push(start);
    while (stack.Count > 0)
    {
        string node = stack.Pop();
        if (!visited.Add(node)) continue;
        order.Add(node);
        if (graph.TryGetValue(node, out var neighbors))
            foreach (string next in neighbors) stack.Push(next);
    }
    return order;
}
```
### Graph problems by pattern
- connected components
- cycle detection
- bipartite check
- shortest path in weighted graph
- shortest path in unweighted graph
- topological ordering of dependencies
- minimum spanning tree

### Shortest path algorithms
#### BFS
- works when all edge weights are equal
- time complexity O(V + E)

#### Dijkstra
- works with non-negative weights
- greedy approach using a priority structure
- time complexity O((V + E) log V) with a heap-like structure

#### Bellman-Ford
- handles negative edges
- detects negative cycles
- more expensive: O(VE)

Dijkstra repeatedly removes the cheapest tentative distance from a min-heap and relaxes outgoing edges (`dist[v] = min(dist[v], dist[u] + weight)`). It requires non-negative edge weights. Store a new heap entry whenever a distance improves; ignore popped entries that no longer match the best distance. Bellman-Ford instead scans every edge up to V−1 times; a further possible improvement indicates a reachable negative cycle. Use BFS for equal-cost edges, Dijkstra for non-negative weights, and Bellman-Ford when negative weights are allowed.

### Topological sorting
Used when tasks depend on earlier tasks.
- Kahn's algorithm: process nodes with zero in-degree
- DFS-based approach: recursive ordering

In Kahn's algorithm, compute each vertex's indegree, enqueue all zero-indegree vertices, then remove their outgoing edges and enqueue newly-zero vertices. If the output contains fewer than V vertices, a cycle exists, so no topological order is possible. Both Kahn and DFS variants run in O(V+E).

### Minimum spanning tree
- Prim's algorithm: grows a tree from a frontier
- Kruskal's algorithm: sorts edges and unions components

An MST is defined for a weighted, undirected graph. Kruskal sorts edges and accepts an edge only when Union-Find says its endpoints are in different components; complexity is O(E log E). Prim grows from one start vertex, repeatedly taking the lightest edge to an unvisited vertex; with an adjacency list and heap it is O(E log V). Both select V−1 edges for a connected graph; a disconnected graph instead has a minimum spanning forest.

Bellman-Ford, topological-sort, Kruskal, and Prim reference implementations are provided in Section 17.17. For cycle detection, distinguish directed from undirected graphs; an undirected Union-Find test is not a correct directed-cycle test.

### Graph interview tips
- Decide whether the graph is directed or undirected
- Check for weighted vs unweighted edges
- Determine whether the problem is about path count, path length, or connectivity
- Distinguish between visited states and values in the graph

## 4. Hashing and Hash Tables

### Core idea
Hashing maps keys to indices using a hash function, allowing near-constant-time access in many cases.

### Components of a hash table
- hash function
- bucket array
- collision strategy

### Collision handling
- chaining: store entries in linked buckets or nested lists
- open addressing: probe for alternate slots

### Why hash tables matter
They are used for:
- frequency counting
- set membership checks
- dictionary lookups
- deduplication
- caching

### Average vs worst case
- average: O(1) for lookup, insert, delete
- worst-case: O(n) if all keys collide

### Interview concerns
- choose a proper hash function for custom objects
- handle mutable keys carefully
- consider load factor and rehashing when the table becomes full

A hash function maps a key to a bucket; collisions are resolved either by **chaining** (multiple entries per bucket) or **open addressing** (probe alternate array slots). As load factor rises, resizing and rehashing spreads entries over a larger bucket array. Expected lookup/insert/delete is O(1), but heavy collisions can make an operation O(n).

```csharp
var counts = new Dictionary<string, int>();
foreach (string word in new[] { "cat", "dog", "cat" })
    counts[word] = counts.GetValueOrDefault(word) + 1;
```
Dictionary/set keys must be hashable; equality and hash results must remain consistent while a key is stored. C#'s `Dictionary<TKey, TValue>` and `HashSet<T>` provide the collision handling and resizing, so normally use them rather than implementing a table yourself.

## 5. Strings and Pattern Matching

### Why strings matter
Strings are often the core of interview tasks, especially in text processing, parsing, and search.

### Core string techniques
- substring check
- palindrome detection
- anagram detection
- longest common subsequence
- longest common prefix
- word frequency analysis

Two pointers check a palindrome in O(n) time and O(1) extra space. A frequency map checks anagrams in O(n) expected time. A trie shares common prefixes so inserting or searching a length-L word costs O(L), rather than scanning every stored string.

```csharp
static bool AreAnagrams(string a, string b)
{
    var counts = new Dictionary<char, int>();
    foreach (char c in a) counts[c] = counts.GetValueOrDefault(c) + 1;
    foreach (char c in b) counts[c] = counts.GetValueOrDefault(c) - 1;
    return counts.Values.All(count => count == 0);
}

static bool IsPalindrome(string text)
{
    int left = 0, right = text.Length - 1;
    while (left < right)
        if (text[left++] != text[right--]) return false;
    return true;
}
```
Decide explicitly whether case, whitespace, punctuation, and Unicode normalization matter; normalize only if the problem requires it.

### Pattern matching algorithms
#### Naive approach
- compare pattern against each position
- acceptable for small inputs only

#### KMP (Knuth-Morris-Pratt)
- preprocess pattern to build prefix table
- avoids repeated comparisons
- efficient for multiple pattern searches

KMP's LPS array stores, for each pattern prefix, the length of its longest proper prefix that is also a suffix. After a mismatch, this tells the search where to resume in the pattern without moving the text pointer backward; total time is O(n+m).

#### Z algorithm
- computes longest prefix match for each suffix
- useful for efficient substring searches

The Z value at position i is the longest prefix match starting at i. It maintains a rightmost `[left, right)` match window and reuses known values to achieve linear time. For search, compute Z on `pattern + separator + text`; each text position with Z at least the pattern length is a match.

#### Rabin-Karp
- uses rolling hash to compare substrings efficiently
- great for many pattern checks, though collisions must be managed

Rabin-Karp hashes the pattern and each same-length text window. Remove the outgoing character's weighted contribution and add the incoming character to roll the hash forward in O(1). Verify equal-hash candidates character-by-character because different strings can collide.

### Trie
A trie stores strings by character path.

Use cases:
- dictionary lookup
- autocomplete
- word prefix queries
- lexicographic traversal

Time complexity for insertion/search is O(length of word), often better than naive scanning across many strings.

Each trie node maps a character to a child node and has an end-of-word marker. The marker distinguishes a complete stored word from a prefix: if `"car"` and `"cart"` are stored, reaching the node for `r` does not by itself prove `"car"` is a word.

```csharp
sealed class TrieNode
{
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsWord { get; set; }
}

sealed class Trie
{
    private readonly TrieNode root = new();
    public void Insert(string word)
    {
        TrieNode node = root;
        foreach (char c in word)
        {
            if (!node.Children.TryGetValue(c, out TrieNode? child))
                node.Children[c] = child = new TrieNode();
            node = child;
        }
        node.IsWord = true;
    }
    public bool Contains(string word)
    {
        TrieNode? node = root;
        foreach (char c in word)
            if (!node.Children.TryGetValue(c, out node)) return false;
        return node.IsWord;
    }
    public bool HasPrefix(string prefix)
    {
        TrieNode? node = root;
        foreach (char c in prefix)
            if (!node.Children.TryGetValue(c, out node)) return false;
        return true;
    }
}
```
Full KMP, Z, Rabin-Karp, and prefix-query trie examples are in Section 17.7 and 17.18.

## 6. Sorting and Searching

### Sorting fundamentals
Sorting is often a prerequisite for more advanced logic, and interview problems may ask you to choose the best sort based on constraints.

### Comparison sorts
#### Merge sort
- stable
- O(n log n)
- uses divide-and-conquer
- good for external sorting and predictable performance

Merge sort divides the input, recursively sorts each half, then merges two sorted halves by repeatedly taking the smaller front item. The merge is O(n), giving O(n log n) total time and O(n) auxiliary space. Taking from the left first on ties preserves stability.

#### Quick sort
- in-place average O(n log n)
- worst-case O(n^2)
- useful in practice when implemented well
- performance depends heavily on partition choice

Quicksort partitions values around a pivot so smaller values go on one side and larger ones on the other, then recursively sorts both sides. Balanced partitions yield O(n log n); repeatedly choosing a poor pivot yields O(n²). Randomized or median-based pivot choices reduce the chance of consistently poor partitions.

#### Heap sort
- O(n log n)
- in-place and no extra structure beyond heap operations
- weaker constant factors than merge sort in many contexts

Heapsort first builds a max-heap, then repeatedly swaps the maximum at the root with the last unsorted value and sifts the new root down. Heap construction is O(n), and n removals cost O(n log n) total. It uses O(1) auxiliary array space but is not stable.

### Non-comparison sorts
- counting sort: linear when range is small and bounded
- radix sort: handles integers or fixed-length keys efficiently
- bucket sort: beneficial when data is uniformly distributed

Counting sort counts each key in a bounded range, then emits values by count: O(n+k) time and O(k) space for n items and key range k. Radix sort applies a stable sort to each digit/character position (least-significant first in the common variant). Bucket sort distributes values into buckets, sorts each bucket, then concatenates; its speed depends on a favorable distribution.

For application code, C#'s `List<T>.Sort` (or LINQ `OrderBy`) is usually the right choice:

```csharp
var records = new List<(string Name, int Score)>
{
    ("pear", 3), ("apple", 2), ("plum", 2)
};
records.Sort((a, b) =>
{
    int byScore = a.Score.CompareTo(b.Score);
    return byScore != 0 ? byScore : string.CompareOrdinal(a.Name, b.Name);
});
```
### Searching
The problem is not just find a value; it is often about choosing the right search strategy based on data ordering.

#### Binary search
Works when the collection is sorted or monotonic.
- O(log n)
- requires a monotonic predicate or ordering

Interview variations:
- lower bound
- upper bound
- first true in a sorted predicate array
- search in rotated structures

Binary search maintains a candidate interval and halves it each iteration. A half-open interval `[low, high)` makes the empty interval `low == high` explicit. For lower bound, move `high` left when `values[mid] >= target`; otherwise move `low` past `mid`:

```csharp
static int LowerBound(int[] values, int target)
{
    int low = 0, high = values.Length;
    while (low < high)
    {
        int mid = low + (high - low) / 2;
        if (values[mid] < target) low = mid + 1;
        else high = mid;
    }
    return low;
}
```
This returns the insertion position of the first value at least target in O(log n). The same boundary search works for a monotonic false-then-true predicate. Merge sort, counting sort, radix sort, and additional search examples are in Section 17.8 and 17.18.

## 7. Recursion and Divide and Conquer

### Why recursion matters
Recursion models problems naturally when a task can be broken into smaller self-similar subproblems.

### Typical recursion patterns
- tree traversal
- divide-and-conquer algorithms
- backtracking search
- combinatorial generation

### Recursion pitfalls
- missing base case
- recomputing subproblems
- deep recursion causing stack overflow

### Memoization
Memoization stores computed results so repeated states are not solved again.

Use cases:
- Fibonacci-like recurrence
- knapsack
- longest path with overlap
- DP with repeated state transitions

The key for the cache must encode all information that affects the result. A missing base case prevents termination; a cache key that omits relevant state can silently return incorrect results.

```csharp
static long Fibonacci(int n, Dictionary<int, long>? memo = null)
{
    memo ??= new Dictionary<int, long>();
    if (n < 2) return n;
    if (memo.TryGetValue(n, out long value)) return value;
    return memo[n] = Fibonacci(n - 1, memo) + Fibonacci(n - 2, memo);
}
```
This changes Fibonacci from exponential repeated work to O(n) time and O(n) cached states, though recursion still uses O(n) call-stack space.

### Divide and conquer
Break the task into smaller parts, solve each part independently, and combine results.

Examples:
- merge sort
- quick sort
- closest pair strategies
- many optimization algorithms

Merge sort illustrates the pattern: divide the list in half, solve both halves, merge in linear time. Its recurrence is `T(n) = 2T(n/2) + O(n)`, which is O(n log n). Divide-and-conquer subproblems are often independent; when they overlap substantially, dynamic programming can avoid recomputing them.

### Master theorem
Use it to estimate time complexity for recurrence relations of the form:
T(n) = aT(n/b) + O(n^k)

Important cases:
- if a < b^k, non-recursive work dominates: O(n^k)
- if a = b^k, levels contribute equally: O(n^k log n)
- if a > b^k, recursive leaves dominate: O(n^(log_b a))

The theorem applies to recurrences in the stated form with regularity assumptions; not every recurrence can be solved by applying these cases mechanically.

## 8. Dynamic Programming

### Core idea
Dynamic programming solves problems by breaking them into overlapping subproblems and storing the results.

### Key concept: state
A DP state must represent the information needed to decide the next step.

Examples:
- current index
- remaining capacity
- visited set or last chosen element
- total count or maximum value

### Two common patterns
#### Top-down memoization
- recursive function with cache
- easy to express and debug
- often best when state space is sparse

#### Bottom-up tabulation
- iterative fill of table from smaller states up to bigger states
- often more memory predictable
- easier to reason about for optimization-heavy problems

### Classic DP patterns
- 0/1 knapsack
- unbounded knapsack
- longest increasing subsequence
- longest common subsequence
- edit distance
- coin change
- matrix chain optimization
- interval DP
- string DP

### DP interview insights
- Define the state precisely before coding
- Check whether the problem is optimization, counting, or feasibility
- Identify whether transitions are additive or dependent on previous states
- Watch for memory blow-ups and consider rolling arrays when only the previous layer matters

For 0/1 knapsack, `dp[c]` means best value using processed items and capacity c. Iterate capacity downward so an item cannot be reused during its own iteration:

```csharp
static int Knapsack(int[] weights, int[] values, int capacity)
{
    var dp = new int[capacity + 1];
    for (int i = 0; i < weights.Length; i++)
        for (int cap = capacity; cap >= weights[i]; cap--)
            dp[cap] = Math.Max(dp[cap], dp[cap - weights[i]] + values[i]);
    return dp[capacity];
}
```
For unbounded knapsack, iterate capacities upward so the current item can contribute repeatedly. LCS and edit distance use prefix-pair states; coin change uses amount states; interval DP computes short ranges before longer ranges. Define the state, base cases, transition, and iteration order explicitly. Representative LCS, edit-distance, and coin-change implementations are in Section 17.10 and 17.20.

## 9. Greedy Algorithms

### Core idea
Greedy algorithms make locally optimal decisions and hope that those choices lead to a globally optimal solution.

### When greedy is valid
Greedy works only when the problem satisfies a matroid-like or exchange property. In interviews, you usually need a proof or clear reasoning.

### Standard greedy use cases
- interval scheduling
- activity selection
- minimum coin change under canonical coin systems
- Huffman coding
- graph optimization with ordering constraints

### Greedy pitfalls
- choosing the next obvious item may not be globally correct
- sorting order matters
- many problems need a proof of correctness before trust

For interval scheduling, choosing the compatible interval with the earliest finishing time is safe: it leaves maximum room for all later choices. Sorting by finish time followed by a single scan gives O(n log n).

```csharp
static List<(int Start, int End)> SelectActivities(List<(int Start, int End)> intervals)
{
    var selected = new List<(int, int)>();
    int finish = int.MinValue;
    foreach (var interval in intervals.OrderBy(x => x.End))
        if (interval.Start >= finish)
        {
            selected.Add(interval);
            finish = interval.End;
        }
    return selected;
}
```
Greedy coin change is not generally valid: with coins `[1, 3, 4]` and amount 6, choosing 4 first needs three coins, while `3+3` needs two. Huffman coding is another valid greedy method: combine the two least-frequent symbols repeatedly; the resulting prefix-free tree minimizes weighted code length. See Sections 17.11 and 17.20 for executable examples.

## 10. Backtracking

### Core idea
Backtracking builds candidates step by step and abandons paths that cannot lead to a valid result.

### Typical patterns
- permutations
- combinations
- subsets
- Sudoku and other constraint-satisfaction problems
- N-Queens
- path search under constraints

### Pruning
Pruning is central to backtracking performance.
- bound checks
- invalid partial state detection
- symmetry reduction
- early cutoffs when constraints are violated

### Complexity
Backtracking can be exponential, but pruning often makes it feasible on reasonable constraints.

At each step, choose, recurse, and undo the choice. A subset search has two branches per item and produces 2^n subsets, so the output alone is exponential. Prune only when a partial state cannot lead to a valid solution; for N-Queens, reject a placement if its column or either diagonal is already occupied.

```csharp
static List<List<int>> Subsets(int[] values)
{
    var result = new List<List<int>>();
    var current = new List<int>();
    void Search(int index)
    {
        if (index == values.Length) { result.Add(new(current)); return; }
        Search(index + 1); // Exclude
        current.Add(values[index]);
        Search(index + 1); // Include
        current.RemoveAt(current.Count - 1); // Undo
    }
    Search(0);
    return result;
}
```
The N-Queens example with column/diagonal pruning is in Section 17.20.

## 11. Disjoint Set Union (Union-Find)

### Core idea
Union-Find manages partitioning elements into connected groups, supporting:
- find parent of an element
- union two sets

Each component is represented by a root. `find` follows parent links to the root; `union` links roots only if they differ. Path compression points visited nodes directly toward the root, while union by size attaches the smaller component under the larger:

```csharp
sealed class Dsu
{
    private readonly int[] parent, size;
    public Dsu(int n)
    {
        parent = Enumerable.Range(0, n).ToArray();
        size = Enumerable.Repeat(1, n).ToArray();
    }
    public int Find(int x)
    {
        if (parent[x] != x) parent[x] = Find(parent[x]);
        return parent[x];
    }
    public bool Union(int a, int b)
    {
        a = Find(a); b = Find(b);
        if (a == b) return false;
        if (size[a] < size[b]) (a, b) = (b, a);
        parent[b] = a; size[a] += size[b];
        return true;
    }
}
```
`union` returning false signals that an undirected edge joins vertices already connected, which is how Kruskal detects a cycle.

### Use cases
- connected components in a graph
- cycle detection in undirected graph
- Kruskal's MST algorithm
- network connectivity problems

### Key optimization
- path compression
- union by rank or size

### Complexity
Near-constant amortized operations, making it excellent for dynamic connectivity tasks.

With path compression and union by size/rank, operations are amortized O(α(n)), where α is the inverse Ackermann function. DSU supports merging and connectivity queries, not splitting a component after removing an edge.

## 12. Bit Manipulation

### Why it matters
Bits enable efficient operations on integer values, especially when constraints are tight.

### Common operations
- AND, OR, XOR, NOT
- left/right shifts
- masking
- checking set bits
- toggling bits
- clearing bits
- extracting lowest set bit

For bit position k, `(mask & (1 << k)) != 0` checks it; `mask | (1 << k)` sets it; `mask ^ (1 << k)` toggles it; `mask & ~(1 << k)` clears it. The expression `mask & (mask - 1)` clears the lowest set bit.

### Useful patterns
- parity checks
- power-of-two detection
- bit counts
- subset enumeration with masks
- XOR-based cancellation properties

```csharp
static bool IsPowerOfTwo(int value) => value > 0 && (value & (value - 1)) == 0;

static List<int> SetBitPositions(int mask)
{
    var positions = new List<int>();
    while (mask != 0)
    {
        int lowest = mask & -mask;
        positions.Add(System.Numerics.BitOperations.TrailingZeroCount((uint)lowest));
        mask &= mask - 1;
    }
    return positions;
}
```
`a ^ a == 0` and `a ^ 0 == a`, so XOR isolates one value when every other value occurs exactly twice. A mask can encode a subset of n items, but iterating all `2**n` masks remains exponential.

### Interview note
Bit manipulation is often a speed and memory optimization, but its logic must be clear and safe.

## 13. Advanced Tree and Index Structures

### Segment tree
A segment tree supports range queries and point updates efficiently.

Use cases:
- range sum
- range minimum or maximum
- interval updates
- dynamic statistics

Operations:
- build: O(n)
- query: O(log n)
- update: O(log n)

Each node summarizes an interval; its two children summarize the left and right halves, and the parent combines their summaries (sum, min, max, etc.). A query combines only fully covered nodes and descends along interval boundaries. A point update changes its leaf then recomputes summaries along the root path. Lazy propagation is needed for many efficient range-update operations. A complete range-sum implementation is in Section 17.19.

### Fenwick tree
A Fenwick tree is a more compact alternative for cumulative frequency-like operations.

Use cases:
- prefix sums
- frequency updates
- rank queries

Fenwick index i stores a range determined by its lowest set bit `i & -i`. A point update advances by `i += i & -i`; a prefix query moves backward by `i -= i & -i`. Both run in O(log n), and a range sum is `prefix(right) - prefix(left - 1)`. See Section 17.15 for a complete implementation.

### Trie
Useful for large sets of strings where prefix operations matter.

Trie insertion and lookup follow one edge per character and use an end-of-word flag to distinguish a complete word from a prefix. The implementation and an explanation of prefix queries are in Section 5; see Section 17.7 for the runnable version.

## 14. Problem-Solving Framework

When you face a coding problem, follow a repeatable framework:

### Step 1: Understand the input and output
- what are the constraints?
- what does success mean?
- are values unique, ordered, or repeated?

### Step 2: Identify the core requirement
- search
- count
- optimize value
- detect feasibility
- reconstruct path

### Step 3: Choose the right model
- graph, tree, set, map, string, DP state, greedy structure

### Step 4: Estimate complexity upfront
- time and space expectations
- whether the naive solution is acceptable

### Step 5: Code cleanly
- define helper functions
- keep variable names meaningful
- keep state transitions explicit

### Step 6: Validate with edge cases
- empty input
- one element
- duplicates
- maximum/minimum values
- cyclic or contradictory constraints

### Worked example: shortest flight count
Suppose every flight counts as one hop and we need the minimum hops between two airports. Model airports as vertices and flights as edges; because all edges have equal cost, use BFS. Mark an airport visited when enqueuing it, store its distance, and optionally store a parent to reconstruct the route. This takes O(V+E) time and O(V) space. Test identical start and destination, no route, a direct route, and multiple equal-length routes. A runnable BFS implementation is in Section 17.4.

For any solution, explain the invariant that makes it correct: for example, BFS's queue is in nondecreasing distance order, while binary search preserves the target in its candidate interval. Then trace a small example and test boundary cases before claiming the complexity.

## 15. Common Interview Mistakes

- writing code before identifying the right pattern
- not checking constraints before choosing an algorithm
- ignoring the difference between average and worst-case complexity
- overlooking repeated subproblems in recursive logic
- failing to reason about correctness, not just code execution
- skipping edge case testing

## 16. Final Interview Advice

The best interview performance comes from clear reasoning:
- describe the idea before coding
- explain why the chosen structure fits the problem
- mention trade-offs
- narrate time and space complexity
- test with a few targeted examples

The goal is not just to produce code; it is to demonstrate that you can think like a problem solver.

## Additional Foundational Structures and Patterns

The earlier outline focused on major algorithm families. Arrays, linked lists, stacks, queues, and common array patterns are also core interview tools.

### Arrays and prefix sums
Arrays provide O(1) indexed reads, but inserting/removing near the front generally shifts later values and costs O(n). A prefix-sum array lets a static inclusive range sum be answered in O(1) after O(n) preprocessing:

```csharp
static long[] BuildPrefix(int[] values)
{
    var prefix = new long[values.Length + 1];
    for (int i = 0; i < values.Length; i++) prefix[i + 1] = prefix[i] + values[i];
    return prefix;
}

static long RangeSum(long[] prefix, int left, int right) => prefix[right + 1] - prefix[left];
```
Here `prefix[i]` is the sum of the first i values. This supports static range queries, but changing a value requires updating later prefix entries; use a Fenwick or segment tree when updates and queries are mixed.

### Two pointers and sliding windows
Two pointers exploit order or a maintained interval to avoid reconsidering pairs. In a sorted array, move the left pointer up when the sum is too small and the right pointer down when it is too large. A sliding window similarly advances right to include data and left to restore a constraint, often solving a contiguous-subarray problem in O(n).

```csharp
static bool HasSortedPair(int[] values, int target)
{
    int left = 0, right = values.Length - 1;
    while (left < right)
    {
        long sum = (long)values[left] + values[right];
        if (sum == target) return true;
        if (sum < target) left++; else right--;
    }
    return false;
}

static int LongestUniqueSubstring(string text)
{
    var lastSeen = new Dictionary<char, int>();
    int left = 0, best = 0;
    for (int right = 0; right < text.Length; right++)
    {
        char c = text[right];
        if (lastSeen.TryGetValue(c, out int previous)) left = Math.Max(left, previous + 1);
        lastSeen[c] = right;
        best = Math.Max(best, right - left + 1);
    }
    return best;
}
```
The pair search requires sorted input. The substring window uses a map of last-seen positions and advances left past a repeated character, so every index is processed only a constant number of times.

### Stacks and queues
A stack is LIFO (last in, first out); it is useful for DFS, parsing, and undo histories. A queue is FIFO (first in, first out); it is useful for BFS and scheduling. In C#, use `Stack<T>` for LIFO and `Queue<T>` for FIFO; their push/pop and enqueue/dequeue operations are amortized O(1).

```csharp
var stack = new Stack<string>();
stack.Push("first"); stack.Push("second");
string top = stack.Pop();

var queue = new Queue<string>(new[] { "first", "second" });
string front = queue.Dequeue();
queue.Enqueue("third");
```
### Monotonic stack
A monotonic stack keeps values (or indices) in increasing or decreasing order. When a new value violates that order, pop items whose answer has just been found. This solves next-greater-element and histogram-boundary problems in O(n), since each item is pushed and popped at most once.

```csharp
static int[] NextGreater(int[] values)
{
    var answer = Enumerable.Repeat(-1, values.Length).ToArray();
    var stack = new Stack<int>(); // unresolved indices
    for (int i = 0; i < values.Length; i++)
    {
        while (stack.Count > 0 && values[stack.Peek()] < values[i])
            answer[stack.Pop()] = values[i];
        stack.Push(i);
    }
    return answer;
}
```
### Linked lists
A singly linked list node stores a value and a reference to the next node. Insertion/removal at a known node is O(1), but reaching the kth item is O(k); unlike arrays, nodes are not directly indexed. A dummy/sentinel node simplifies operations at the head.

```csharp
sealed class ListNode
{
    public int Value;
    public ListNode? Next;
    public ListNode(int value, ListNode? next = null) { Value = value; Next = next; }
}

static ListNode? ReverseList(ListNode? head)
{
    ListNode? previous = null, current = head;
    while (current is not null)
    {
        ListNode? following = current.Next;
        current.Next = previous;
        previous = current;
        current = following;
    }
    return previous;
}
```
The three-pointer loop reverses one link at a time and uses O(1) extra space. For cycle detection, Floyd's slow/fast pointers move one and two links per step; if they meet, a cycle exists. If the list ends first, it is acyclic.

## 17. How the Concepts Work: C# Examples

The topic chapters above explain the concepts where they belong. This companion reference collects C# implementations for readers who want to study or adapt the algorithms. Unless noted otherwise, examples use built-in collections to keep the algorithm itself easy to see. Method snippets are intended to be placed inside a class; class examples show their own declarations. Examples using `PriorityQueue<TElement, TPriority>` require .NET 6 or later.

For snippets using framework collections and LINQ, include `using System;`, `using System.Collections.Generic;`, and `using System.Linq;` at the top of the file.

### 17.1 Complexity analysis in practice

Count how the number of operations grows with input size, not how many seconds one run happens to take.

```csharp
static bool ContainsPairWithSum(int[] values, int target)
{
    var seen = new HashSet<int>();
    foreach (int value in values)
    {
        if (seen.Contains(target - value)) return true;
        seen.Add(value);
    }
    return false;
}
```
The loop scans each value once, so expected time is O(n); the set can hold n values, so auxiliary space is O(n). A nested comparison of every pair would take O(n²) time and O(1) extra space. Big-O describes an asymptotic upper bound, Big-Omega a lower bound, and Big-Theta a tight bound; these notations do not by themselves say whether the bound is worst-case or average-case. State that separately.

### 17.2 Trees, traversals, BSTs, and AVL balancing

A traversal chooses an order for visiting nodes. Preorder visits a node before its children, inorder visits left/node/right, postorder visits children before the node, and breadth-first traversal visits one level at a time.

```csharp
static Dictionary<string, int> BfsDistances(
    Dictionary<string, List<string>> graph, string start)
{
    var distance = new Dictionary<string, int> { [start] = 0 };
    var queue = new Queue<string>();
    queue.Enqueue(start);
    while (queue.Count > 0)
    {
        string node = queue.Dequeue();
        if (!graph.TryGetValue(node, out var neighbors)) continue;
        foreach (string next in neighbors)
            if (!distance.ContainsKey(next))
            {
                distance[next] = distance[node] + 1;
                queue.Enqueue(next);
            }
    }
    return distance;
}

static List<string> Dfs(Dictionary<string, List<string>> graph, string start)
{
    var visited = new HashSet<string>();
    var order = new List<string>();
    var stack = new Stack<string>();
    stack.Push(start);
    while (stack.Count > 0)
    {
        string node = stack.Pop();
        if (!visited.Add(node)) continue;
        order.Add(node);
        if (graph.TryGetValue(node, out var neighbors))
            foreach (string next in neighbors) stack.Push(next);
    }
    return order;
}
```
A binary search tree (BST) sends smaller keys left and larger keys right. Search follows only one child at each step; it takes O(h), where h is tree height. Inserting sorted values into an ordinary BST can make it a chain, so h can be n and operations can degrade to O(n).

An AVL tree is a BST that also stores a height per node and enforces `abs(height(left) - height(right)) <= 1` at every node. After insertion, update heights while returning toward the root. If a node's balance factor becomes +2 or -2, rotate locally:

- **LL case**: insertion into the left child’s left subtree; rotate right.
- **RR case**: insertion into the right child’s right subtree; rotate left.
- **LR case**: insertion into the left child’s right subtree; rotate left on the child, then right on the node.
- **RL case**: insertion into the right child’s left subtree; rotate right on the child, then left on the node.

Rotations preserve the BST inorder ordering while reducing height. This compact implementation covers insertion and all four cases:

```csharp
sealed class AvlNode(int key)
{
    public int Key = key, Height = 1;
    public AvlNode? Left, Right;
}

static int Height(AvlNode? node) => node?.Height ?? 0;
static void Update(AvlNode node) => node.Height = 1 + Math.Max(Height(node.Left), Height(node.Right));

static AvlNode RotateRight(AvlNode y)
{
    AvlNode x = y.Left!; y.Left = x.Right; x.Right = y;
    Update(y); Update(x); return x;
}
static AvlNode RotateLeft(AvlNode x)
{
    AvlNode y = x.Right!; x.Right = y.Left; y.Left = x;
    Update(x); Update(y); return y;
}
static AvlNode Insert(AvlNode? node, int key)
{
    if (node is null) return new AvlNode(key);
    if (key < node.Key) node.Left = Insert(node.Left, key);
    else if (key > node.Key) node.Right = Insert(node.Right, key);
    else return node; // Ignore duplicates.
    Update(node);
    int balance = Height(node.Left) - Height(node.Right);
    if (balance > 1)
    {
        if (key > node.Left!.Key) node.Left = RotateLeft(node.Left); // LR
        return RotateRight(node); // LL or completed LR
    }
    if (balance < -1)
    {
        if (key < node.Right!.Key) node.Right = RotateRight(node.Right); // RL
        return RotateLeft(node); // RR or completed RL
    }
    return node;
}
```
For example, inserting `30, 20, 10` creates an LL imbalance at 30; a right rotation makes 20 the root of that subtree. AVL search/insert are O(log n) because the maintained height is logarithmic. This sample omits deletion, which needs the same height updates and rebalancing after removing a node.

A **red-black tree** uses a color bit and rules rather than requiring every node to have AVL-tight balance. Its rules (including black root, no red parent-child pair, and equal black count on every root-to-leaf path) guarantee O(log n) height. Insertions and deletions repair violations using recoloring and rotations. Standard libraries usually provide a tested balanced-tree implementation; a full red-black implementation is lengthy and should not be approximated with only a few rotation snippets.

A **B-tree** keeps multiple sorted keys in each node and has many children, keeping height small when each disk read can fetch a whole node. On insertion, a full node is split and its middle key promoted to its parent. A **B+ tree** stores records (or record pointers) in linked leaves and internal nodes only as routing keys; linked leaves make range scans efficient. These are database/storage indexes, not just binary trees.

### 17.3 Heaps and priority queues

A binary heap is usually stored in an array. For index `i`, children are `2*i+1` and `2*i+2`; the parent is `(i-1)//2`. In a min-heap every parent is no greater than its children. Insertion bubbles a new value up; removal swaps the root with the last value and sifts the new root down.

```csharp
var minHeap = new PriorityQueue<string, int>();
minHeap.Enqueue("normal", 3);
minHeap.Enqueue("urgent", 1);
minHeap.Enqueue("soon", 2);
minHeap.Enqueue("now", 0);
string task = minHeap.Dequeue(); // "now", the lowest priority number
// Enqueue/dequeue: O(log n); Peek: O(1).
```
Peek is O(1); enqueue/dequeue are O(log n). .NET's `PriorityQueue<TElement, TPriority>` dequeues the lowest priority first. To get largest values, reverse the priority comparison or use a suitable priority type/comparer.

### 17.4 Graph representations and traversals

An adjacency list stores each vertex’s neighbors and uses O(V + E) space. An adjacency matrix stores an entry for every vertex pair, uses O(V²) space, and makes edge-existence checks O(1). For a graph with `A -- B -- C`, an undirected adjacency list includes each edge in both endpoints’ neighbor lists.

BFS uses a queue and explores by distance layers, which yields shortest edge-count paths in an unweighted graph. Mark nodes when enqueuing so each node enters the queue once. DFS uses a stack (or recursion) and explores a branch before backtracking.

```csharp
static Dictionary<string, int> BfsDistances(
    Dictionary<string, List<string>> graph, string start)
{
    var distance = new Dictionary<string, int> { [start] = 0 };
    var queue = new Queue<string>();
    queue.Enqueue(start);
    while (queue.Count > 0)
    {
        string node = queue.Dequeue();
        if (!graph.TryGetValue(node, out var neighbors)) continue;
        foreach (string next in neighbors)
            if (!distance.ContainsKey(next))
            {
                distance[next] = distance[node] + 1;
                queue.Enqueue(next);
            }
    }
    return distance;
}

static List<string> Dfs(Dictionary<string, List<string>> graph, string start)
{
    var visited = new HashSet<string>();
    var order = new List<string>();
    var stack = new Stack<string>();
    stack.Push(start);
    while (stack.Count > 0)
    {
        string node = stack.Pop();
        if (!visited.Add(node)) continue;
        order.Add(node);
        if (graph.TryGetValue(node, out var neighbors))
            foreach (string next in neighbors) stack.Push(next);
    }
    return order;
}
```
Both traversals take O(V + E) across the reachable component. For disconnected graphs, start a traversal from each still-unvisited vertex to find all components. In a directed graph, neighbor direction matters; in an undirected graph, each edge must be represented both ways.

### 17.5 Shortest paths and graph ordering

Use **BFS** when all edges have equal cost. **Dijkstra** repeatedly finalizes the cheapest known frontier vertex and relaxes its outgoing edges; it requires non-negative edge weights. **Bellman-Ford** relaxes every edge up to V−1 times, so it handles negative edges; one more successful relaxation means a reachable negative cycle.

```csharp
static Dictionary<string, long> Dijkstra(
    Dictionary<string, List<(string To, int Weight)>> graph, string start)
{
    var distance = new Dictionary<string, long> { [start] = 0 };
    var queue = new PriorityQueue<string, long>();
    queue.Enqueue(start, 0);
    while (queue.TryDequeue(out string? node, out long cost))
    {
        if (cost != distance[node]) continue; // stale heap entry
        if (!graph.TryGetValue(node, out var edges)) continue;
        foreach (var (to, weight) in edges)
        {
            if (weight < 0) throw new ArgumentException("Dijkstra requires non-negative weights");
            long candidate = cost + weight;
            if (candidate < distance.GetValueOrDefault(to, long.MaxValue))
            {
                distance[to] = candidate;
                queue.Enqueue(to, candidate);
            }
        }
    }
    return distance;
}
```
With a binary heap, Dijkstra is O((V + E) log V). **Topological sorting** orders a directed acyclic graph (DAG) so every prerequisite comes before its dependent task. Kahn’s algorithm counts incoming edges, queues zero-indegree vertices, then removes their outgoing edges. If fewer than V vertices are output, a directed cycle exists.

```csharp
static List<int> TopologicalOrder(Dictionary<int, List<int>> graph)
{
    var indegree = graph.Keys.ToDictionary(node => node, _ => 0);
    foreach (var neighbors in graph.Values)
        foreach (int next in neighbors)
        {
            indegree.TryAdd(next, 0);
            indegree[next]++;
        }
    var queue = new Queue<int>(indegree.Where(pair => pair.Value == 0).Select(pair => pair.Key));
    var order = new List<int>();
    while (queue.Count > 0)
    {
        int node = queue.Dequeue(); order.Add(node);
        if (!graph.TryGetValue(node, out var neighbors)) continue;
        foreach (int next in neighbors)
            if (--indegree[next] == 0) queue.Enqueue(next);
    }
    if (order.Count != indegree.Count) throw new InvalidOperationException("Directed cycle");
    return order;
}
```
A **minimum spanning tree (MST)** connects all vertices of a connected, weighted, undirected graph with minimum total edge weight and no cycles. **Kruskal** sorts edges and accepts one only when its endpoints are in different components (using Union-Find). **Prim** grows one tree by repeatedly choosing the cheapest edge crossing from the tree to an outside vertex. They solve the same MST problem with different ways of choosing the next edge.

### 17.6 Hash tables and collision handling

A hash function turns a key into a bucket index. Different keys can map to the same bucket (a collision). **Chaining** stores a small collection in each bucket. **Open addressing** probes other slots in the same array until it finds the key or an empty slot. As the load factor (entries / capacity) rises, tables typically resize and redistribute entries. Expected lookup is O(1), but pathological collisions can make it O(n).

```csharp
var counts = new Dictionary<string, int>();
foreach (string word in new[] { "cat", "dog", "cat" })
    counts[word] = counts.GetValueOrDefault(word) + 1;
```
Dictionary keys must be hashable and should not change in a way that affects their hash while stored. Built-in dictionaries/sets handle hashing, collision resolution, and resizing; application code should not try to emulate those internals without a specific reason.

### 17.7 String algorithms and tries

For a pattern `P`, KMP builds an LPS (longest proper prefix that is also a suffix) table. On mismatch, it uses the LPS value to keep the useful part of the matched prefix rather than restarting at the next text character. This makes the scan O(n + m).

```csharp
static int KmpFind(string text, string pattern)
{
    if (pattern.Length == 0) return 0;
    var lps = new int[pattern.Length];
    for (int i = 1, length = 0; i < pattern.Length;)
        if (pattern[i] == pattern[length]) lps[i++] = ++length;
        else if (length > 0) length = lps[length - 1];
        else i++;
    for (int i = 0, j = 0; i < text.Length;)
        if (text[i] == pattern[j])
        {
            i++; j++;
            if (j == pattern.Length) return i - j;
        }
        else if (j > 0) j = lps[j - 1];
        else i++;
    return -1;
}
```
The **naive matcher** compares the pattern at each text position (worst case O(nm)). The **Z algorithm** computes, for each position, the length of the substring matching the string’s prefix; concatenating `pattern + separator + text` turns pattern search into checking Z values of at least pattern length (O(n + m)). **Rabin–Karp** hashes each length-m window and updates the hash in O(1) as the window slides; a hash match must be verified character-by-character because collisions are possible.

A **trie** shares common prefixes: each edge represents one character, so search and insertion take O(L) for a word of length L, independent of how many words are stored (apart from child-map costs).

```csharp
sealed class TrieNode
{
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsWord { get; set; }
}

sealed class Trie
{
    private readonly TrieNode root = new();
    public void Insert(string word)
    {
        TrieNode node = root;
        foreach (char c in word)
        {
            if (!node.Children.TryGetValue(c, out TrieNode? child))
                node.Children[c] = child = new TrieNode();
            node = child;
        }
        node.IsWord = true;
    }
    public bool Contains(string word)
    {
        TrieNode? node = root;
        foreach (char c in word)
            if (!node.Children.TryGetValue(c, out node)) return false;
        return node.IsWord;
    }
    public bool HasPrefix(string prefix)
    {
        TrieNode? node = root;
        foreach (char c in prefix)
            if (!node.Children.TryGetValue(c, out node)) return false;
        return true;
    }
}
```
### 17.8 Sorting and binary search

**Merge sort** divides the list in half, recursively sorts both halves, then merges them in order; it is O(n log n), stable, and needs O(n) auxiliary space. **Quicksort** partitions around a pivot and sorts both sides; it is usually in-place and average O(n log n), but poor pivots can produce O(n²). **Heapsort** builds a heap and repeatedly removes its top element; it is O(n log n) and in-place in its array form.

**Counting sort** counts each value and expands those counts; it is O(n + k) for n values in a bounded integer range of size k. **Radix sort** stably sorts by one digit/character position at a time. **Bucket sort** distributes values into ranges, sorts each bucket, then concatenates them; it is most useful when values are reasonably uniform.

C#'s standard sorting APIs are preferable in ordinary application code:

```csharp
var records = new List<(string Name, int Score)>
{
    ("pear", 3), ("apple", 2), ("plum", 2)
};
records.Sort((a, b) =>
{
    int byScore = a.Score.CompareTo(b.Score);
    return byScore != 0 ? byScore : string.CompareOrdinal(a.Name, b.Name);
});
```
Binary search discards half the remaining sorted range per comparison. The half-open interval `[low, high)` avoids special handling around the final index. A lower bound returns the first index whose value is at least the target:

```csharp
static int LowerBound(int[] values, int target)
{
    int low = 0, high = values.Length;
    while (low < high)
    {
        int mid = low + (high - low) / 2;
        if (values[mid] < target) low = mid + 1;
        else high = mid;
    }
    return low;
}
```
This is O(log n). The same template finds the first `True` in a monotonic false-then-true predicate; the predicate must actually be monotonic.

### 17.9 Recursion, memoization, and divide and conquer

Every recursive routine needs a base case and progress toward it. Memoization caches results by state, turning repeated subproblems into one computation. Bottom-up tabulation computes those states in dependency order.

```csharp
static long Fibonacci(int n, Dictionary<int, long>? memo = null)
{
    memo ??= new Dictionary<int, long>();
    if (n < 2) return n;
    if (memo.TryGetValue(n, out long value)) return value;
    return memo[n] = Fibonacci(n - 1, memo) + Fibonacci(n - 2, memo);
}
```
The naive Fibonacci recursion is exponential because it recalculates the same values; caching makes it O(n) time and O(n) stored states (and recursive stack). Merge sort is a divide-and-conquer example: split, solve both halves, combine in linear time, giving `T(n) = 2T(n/2) + O(n) = O(n log n)`.

The Master theorem estimates `T(n) = aT(n/b) + O(n^d)` by comparing `a` with `b^d`: if a < b^d, the nonrecursive work dominates; if equal, an extra logarithmic factor appears; if a > b^d, recursive subproblems dominate. Use the theorem only when the recurrence fits its assumptions.

### 17.10 Dynamic programming: state and transitions

DP is useful when a problem has overlapping subproblems and an optimal substructure. Define a state, define how smaller states produce it, establish base cases, then choose a dependency order.

For 0/1 knapsack, `dp[c]` is the best value achievable with capacity c. Iterate capacities downward so each item is used at most once:

```csharp
static int Knapsack(int[] weights, int[] values, int capacity)
{
    var dp = new int[capacity + 1];
    for (int i = 0; i < weights.Length; i++)
        for (int cap = capacity; cap >= weights[i]; cap--)
            dp[cap] = Math.Max(dp[cap], dp[cap - weights[i]] + values[i]);
    return dp[capacity];
}
```
For **unbounded knapsack**, an item can be reused, so capacities are usually traversed upward. For **coin change**, `dp[a]` can mean the fewest coins for amount a; initialize `dp[0] = 0` and transition from reachable smaller amounts. For **LIS**, a simple O(n²) DP checks all earlier smaller values; a tails-array method improves this to O(n log n).

For two strings, the **longest common subsequence (LCS)** recurrence uses `dp[i][j] = dp[i-1][j-1] + 1` when characters match, otherwise the max of dropping one character. **Edit distance** uses insertion, deletion, and substitution transitions. **Matrix-chain optimization** chooses a split point to minimize multiplication cost; **interval DP** similarly solves ranges from short intervals to long ones. These are patterns, not one-size-fits-all formulas: the state and transition must match the requested output.

### 17.11 Greedy algorithms

A greedy algorithm commits to the best-looking local choice and does not revise it. It is correct only when there is a proof that some optimal solution can start with that choice (often an exchange argument).

For maximum non-overlapping intervals, sorting by earliest finish time is provably safe: it leaves as much room as possible for later intervals.

```csharp
static List<(int Start, int End)> SelectActivities(List<(int Start, int End)> intervals)
{
    var selected = new List<(int, int)>();
    int finish = int.MinValue;
    foreach (var interval in intervals.OrderBy(x => x.End))
        if (interval.Start >= finish)
        {
            selected.Add(interval);
            finish = interval.End;
        }
    return selected;
}
```
This takes O(n log n) for sorting. Greedy coin change is not correct for every coin system; for example, with coins `[1, 3, 4]`, greedy makes 6 using three coins (`4+1+1`) although `3+3` uses two. **Huffman coding** is another greedy algorithm: repeatedly combine the two least-frequent symbols into a binary tree, yielding prefix-free codes with minimum weighted path length.

### 17.12 Backtracking and pruning

Backtracking explores a decision tree: choose an option, recurse, then undo the choice. Pruning checks whether the partial choice can still produce a valid answer and stops hopeless branches early.

```csharp
static List<List<int>> Subsets(int[] values)
{
    var result = new List<List<int>>();
    var current = new List<int>();
    void Search(int index)
    {
        if (index == values.Length) { result.Add(new(current)); return; }
        Search(index + 1); // Exclude
        current.Add(values[index]);
        Search(index + 1); // Include
        current.RemoveAt(current.Count - 1); // Undo
    }
    Search(0);
    return result;
}
```
There are 2ⁿ subsets, so output itself can be exponential. For N-Queens, a partial board can be pruned if two queens share a column or diagonal. For Sudoku, reject a placement as soon as it violates its row, column, or box constraint. Pruning improves practical search but does not always change worst-case exponential complexity.

### 17.13 Disjoint Set Union (Union-Find)

Each set is represented by a root. `find(x)` follows parent links to that root; `union(a, b)` makes one root point to the other. Path compression flattens paths during finds, while union by size attaches the smaller tree below the larger.

```csharp
sealed class Dsu
{
    private readonly int[] parent, size;
    public Dsu(int n)
    {
        parent = Enumerable.Range(0, n).ToArray();
        size = Enumerable.Repeat(1, n).ToArray();
    }
    public int Find(int x)
    {
        if (parent[x] != x) parent[x] = Find(parent[x]);
        return parent[x];
    }
    public bool Union(int a, int b)
    {
        a = Find(a); b = Find(b);
        if (a == b) return false;
        if (size[a] < size[b]) (a, b) = (b, a);
        parent[b] = a; size[a] += size[b];
        return true;
    }
}
```
`union` returns false if an undirected edge would connect vertices already connected, which detects a cycle in Kruskal’s algorithm. With both optimizations, operations are amortized O(α(n)), where α is the very slowly growing inverse Ackermann function.

### 17.14 Bit manipulation

For integer `x` and bit position `k` (counting from zero), `x & (1 << k)` checks a bit, `x | (1 << k)` sets it, `x ^ (1 << k)` toggles it, and `x & ~(1 << k)` clears it. `x & (x - 1)` removes the lowest set bit.

```csharp
static bool IsPowerOfTwo(int value) => value > 0 && (value & (value - 1)) == 0;

static List<int> SetBitPositions(int mask)
{
    var positions = new List<int>();
    while (mask != 0)
    {
        int lowest = mask & -mask;
        positions.Add(System.Numerics.BitOperations.TrailingZeroCount((uint)lowest));
        mask &= mask - 1;
    }
    return positions;
}
```
XOR has the properties `a ^ a == 0` and `a ^ 0 == a`, which explains the common “one unpaired value” trick when every other value occurs exactly twice. A bitmask can represent a subset of n items in n bits; iterate all masks from 0 to `2**n - 1` to enumerate subsets, but note that this is still exponential work.

### 17.15 Segment trees and Fenwick trees

A **segment tree** stores summaries for intervals. Each internal node combines its children (for example, sum or minimum). A range query visits only O(log n) boundary nodes plus fully covered nodes; a point update recomputes summaries up the path. Range updates require an appropriate lazy-propagation design.

A **Fenwick tree (Binary Indexed Tree)** stores partial prefix sums in an array. The low bit `i & -i` determines the interval represented by index i. It is especially compact for point updates and prefix sums:

```csharp
sealed class Fenwick
{
    private readonly long[] tree;
    public Fenwick(int n) => tree = new long[n + 1];
    public void Add(int index, long delta)
    {
        for (int i = index + 1; i < tree.Length; i += i & -i) tree[i] += delta;
    }
    public long PrefixSum(int index)
    {
        long total = 0;
        for (int i = index + 1; i > 0; i -= i & -i) total += tree[i];
        return total;
    }
    public long RangeSum(int left, int right) => PrefixSum(right) - (left == 0 ? 0 : PrefixSum(left - 1));
}
```
Both point update and prefix/range-sum query are O(log n); Fenwick trees are ideal for cumulative sums/frequencies, while segment trees support a broader range of associative summaries and update patterns.

### 17.16 Turning a problem-solving framework into a worked solution

For “find the shortest number of flights between two airports”:

1. Clarify that every flight counts as one hop and identify the airports.
2. Model airports as vertices and flights as edges.
3. Since all edges have equal cost, choose BFS rather than Dijkstra.
4. Mark each airport when enqueuing it; store its distance (and a parent if the route itself is needed).
5. State O(V + E) time and O(V) space for the reachable graph.
6. Test same start/end, no route, a direct flight, and multiple equal-length routes.

This process turns terminology into an implementation choice: the data model determines the algorithm, and the constraints determine whether its complexity is acceptable.

### 17.17 Additional graph algorithms

Bellman-Ford stores edges as `(source, destination, weight)`. It repeatedly relaxes an edge when taking it improves the destination distance. Initializing only the source to zero ensures unreachable negative cycles are not reported as reachable.

```csharp
static Dictionary<string, long> BellmanFord(
    List<string> vertices, List<(string From, string To, int Weight)> edges, string start)
{
    var distance = vertices.ToDictionary(v => v, _ => long.MaxValue);
    distance[start] = 0;
    for (int i = 0; i < vertices.Count - 1; i++)
    {
        bool changed = false;
        foreach (var (from, to, weight) in edges)
            if (distance[from] != long.MaxValue && distance[from] + weight < distance[to])
            { distance[to] = distance[from] + weight; changed = true; }
        if (!changed) break;
    }
    foreach (var (from, to, weight) in edges)
        if (distance[from] != long.MaxValue && distance[from] + weight < distance[to])
            throw new InvalidOperationException("Reachable negative-weight cycle");
    return distance;
}
```
For an undirected graph, Kruskal sorts edges by weight and asks Union-Find whether each edge joins different components. It stops after V−1 accepted edges; fewer means the graph is disconnected.

```csharp
static (long Weight, List<(int A, int B, int Weight)> Edges) Kruskal(
    int vertexCount, List<(int A, int B, int Weight)> edges)
{
    var dsu = new Dsu(vertexCount);
    long total = 0;
    var chosen = new List<(int, int, int)>();
    foreach (var edge in edges.OrderBy(e => e.Weight))
        if (dsu.Union(edge.A, edge.B))
        {
            total += edge.Weight; chosen.Add(edge);
            if (chosen.Count == vertexCount - 1) break;
        }
    if (vertexCount > 0 && chosen.Count != vertexCount - 1)
        throw new InvalidOperationException("Graph is disconnected");
    return (total, chosen);
}
```
Prim instead grows from one start vertex. The heap contains candidate edges crossing from the visited tree to an unvisited vertex:

```csharp
static (long Weight, List<(int From, int To, int Weight)> Edges) Prim(
    Dictionary<int, List<(int To, int Weight)>> graph, int start)
{
    var visited = new HashSet<int> { start };
    var heap = new PriorityQueue<(int From, int To, int Weight), int>();
    foreach (var (to, weight) in graph[start]) heap.Enqueue((start, to, weight), weight);
    long total = 0;
    var chosen = new List<(int, int, int)>();
    while (heap.TryDequeue(out var edge, out _) && visited.Count < graph.Count)
    {
        if (!visited.Add(edge.To)) continue;
        total += edge.Weight; chosen.Add(edge);
        foreach (var (next, weight) in graph[edge.To])
            if (!visited.Contains(next)) heap.Enqueue((edge.To, next, weight), weight);
    }
    if (visited.Count != graph.Count) throw new InvalidOperationException("Graph is disconnected");
    return (total, chosen);
}
```
For bipartite checking, BFS/DFS colors each node with one of two colors and requires every edge to connect different colors. An edge joining equal colors proves the graph is not bipartite. For undirected cycle detection, Union-Find reports a cycle when an edge’s endpoints already have the same root; for directed graphs, use DFS recursion-stack states or topological-sort failure instead.

### 17.18 Additional string and sorting examples

The Z-array gives the longest prefix match beginning at each position. The `[left, right)` window reuses previously computed matches rather than comparing from the beginning each time:

```csharp
static int[] ZValues(string text)
{
    var z = new int[text.Length];
    int left = 0, right = 0;
    for (int i = 1; i < text.Length; i++)
    {
        if (i < right) z[i] = Math.Min(right - i, z[i - left]);
        while (i + z[i] < text.Length && text[z[i]] == text[i + z[i]]) z[i]++;
        if (i + z[i] > right) { left = i; right = i + z[i]; }
    }
    return z;
}
```
Rabin-Karp uses a rolling polynomial hash. This version verifies candidate matches to remain correct even if hashes collide; the modulus keeps intermediate values bounded.

```csharp
static int RabinKarp(string text, string pattern)
{
    int n = text.Length, m = pattern.Length;
    if (m == 0) return 0;
    if (m > n) return -1;
    const long basis = 256, mod = 1_000_000_007;
    long high = 1, patternHash = 0, windowHash = 0;
    for (int i = 1; i < m; i++) high = high * basis % mod;
    for (int i = 0; i < m; i++)
    { patternHash = (patternHash * basis + pattern[i]) % mod; windowHash = (windowHash * basis + text[i]) % mod; }
    for (int start = 0; start <= n - m; start++)
    {
        if (patternHash == windowHash && text.AsSpan(start, m).SequenceEqual(pattern)) return start;
        if (start < n - m)
        {
            windowHash = (windowHash - text[start] * high % mod + mod) % mod;
            windowHash = (windowHash * basis + text[start + m]) % mod;
        }
    }
    return -1;
}
```
Merge sort’s merge step is where the two sorted halves become one sorted list:

```csharp
static int[] MergeSort(int[] values)
{
    if (values.Length < 2) return (int[])values.Clone();
    int middle = values.Length / 2;
    int[] left = MergeSort(values[..middle]), right = MergeSort(values[middle..]);
    var merged = new int[values.Length];
    int i = 0, j = 0, k = 0;
    while (i < left.Length && j < right.Length)
        merged[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.Length) merged[k++] = left[i++];
    while (j < right.Length) merged[k++] = right[j++];
    return merged;
}
```
Counting sort is linear when the key range is small enough to allocate a count array:

```csharp
static int[] CountingSort(int[] values)
{
    if (values.Length == 0) return Array.Empty<int>();
    int low = values.Min(), high = values.Max();
    var counts = new int[high - low + 1];
    foreach (int value in values) counts[value - low]++;
    var result = new int[values.Length];
    int index = 0;
    for (int offset = 0; offset < counts.Length; offset++)
        for (int count = counts[offset]; count > 0; count--) result[index++] = offset + low;
    return result;
}
```
Radix sort applies a stable digit sort repeatedly from least-significant digit to most-significant digit. The input must be non-negative integers in this basic version:

```csharp
static int[] RadixSort(int[] values)
{
    if (values.Any(value => value < 0)) throw new ArgumentException("Only non-negative values supported");
    int[] result = (int[])values.Clone();
    long place = 1;
    while (result.Any(value => value / place > 0))
    {
        var buckets = Enumerable.Range(0, 10).Select(_ => new List<int>()).ToArray();
        foreach (int value in result) buckets[(int)(value / place % 10)].Add(value);
        result = buckets.SelectMany(bucket => bucket).ToArray();
        place *= 10;
    }
    return result;
}
```
### 17.19 Segment tree example

This segment tree stores sums, supports replacing one value, and answers inclusive range-sum queries. Its array is sized to a power of two so every leaf is at the same depth.

```csharp
sealed class SegmentTree
{
    private readonly int size;
    private readonly long[] tree;
    public SegmentTree(int[] values)
    {
        size = 1;
        while (size < values.Length) size *= 2;
        tree = new long[2 * size];
        Array.Copy(values, 0, tree, size, values.Length);
        for (int i = size - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
    }
    public void Update(int index, int value)
    {
        int i = size + index; tree[i] = value;
        for (i /= 2; i > 0; i /= 2) tree[i] = tree[2 * i] + tree[2 * i + 1];
    }
    public long Query(int left, int right)
    {
        long sum = 0; left += size; right += size + 1;
        while (left < right)
        {
            if ((left & 1) == 1) sum += tree[left++];
            if ((right & 1) == 1) sum += tree[--right];
            left /= 2; right /= 2;
        }
        return sum;
    }
}
```
### 17.20 More DP, backtracking, and greedy examples

LCS and edit distance use a two-dimensional table whose prefixes are the states. The first row and column are base cases for an empty prefix:

```csharp
static int LcsLength(string a, string b)
{
    var dp = new int[a.Length + 1, b.Length + 1];
    for (int i = 1; i <= a.Length; i++)
        for (int j = 1; j <= b.Length; j++)
            dp[i, j] = a[i - 1] == b[j - 1] ? dp[i - 1, j - 1] + 1 : Math.Max(dp[i - 1, j], dp[i, j - 1]);
    return dp[a.Length, b.Length];
}

static int EditDistance(string a, string b)
{
    var dp = new int[a.Length + 1, b.Length + 1];
    for (int i = 0; i <= a.Length; i++) dp[i, 0] = i;
    for (int j = 0; j <= b.Length; j++) dp[0, j] = j;
    for (int i = 1; i <= a.Length; i++)
        for (int j = 1; j <= b.Length; j++)
        {
            int cost = a[i - 1] == b[j - 1] ? 0 : 1;
            dp[i, j] = Math.Min(Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1), dp[i - 1, j - 1] + cost);
        }
    return dp[a.Length, b.Length];
}
```
For **coin change**, a bottom-up minimum-count transition tries each coin as the last coin used. This works for arbitrary positive denominations, unlike greedy coin selection:

```csharp
static int MinCoins(int[] coins, int amount)
{
    int unreachable = amount + 1;
    var dp = Enumerable.Repeat(unreachable, amount + 1).ToArray();
    dp[0] = 0;
    for (int value = 1; value <= amount; value++)
        foreach (int coin in coins)
            if (coin > 0 && coin <= value) dp[value] = Math.Min(dp[value], dp[value - coin] + 1);
    return dp[amount] == unreachable ? -1 : dp[amount];
}
```
Backtracking for N-Queens places one queen per row. Sets track occupied columns and diagonals, allowing invalid placements to be rejected immediately:

```csharp
static int NQueensCount(int n)
{
    var columns = new HashSet<int>();
    var descending = new HashSet<int>(); // row - column
    var ascending = new HashSet<int>();  // row + column
    int Place(int row)
    {
        if (row == n) return 1;
        int solutions = 0;
        for (int col = 0; col < n; col++)
        {
            int down = row - col, up = row + col;
            if (columns.Contains(col) || descending.Contains(down) || ascending.Contains(up)) continue;
            columns.Add(col); descending.Add(down); ascending.Add(up);
            solutions += Place(row + 1);
            columns.Remove(col); descending.Remove(down); ascending.Remove(up);
        }
        return solutions;
    }
    return Place(0);
}
```
Huffman coding uses a min-heap to repeatedly combine the two least frequent tree nodes. The combined node is reinserted with their summed frequency until one tree remains:

```csharp
sealed record HuffmanNode(string? Symbol, HuffmanNode? Left = null, HuffmanNode? Right = null);

static HuffmanNode? BuildHuffman(Dictionary<string, int> frequencies)
{
    var queue = new PriorityQueue<HuffmanNode, int>();
    foreach (var (symbol, weight) in frequencies) queue.Enqueue(new HuffmanNode(symbol), weight);
    while (queue.Count > 1)
    {
        queue.TryDequeue(out HuffmanNode? left, out int leftWeight);
        queue.TryDequeue(out HuffmanNode? right, out int rightWeight);
        queue.Enqueue(new HuffmanNode(null, left, right), leftWeight + rightWeight);
    }
    return queue.Count == 0 ? null : queue.Dequeue();
}
```
Walking left as `0` and right as `1` yields each symbol’s code. Because no symbol is a prefix of another, a bitstream can be decoded unambiguously. A single-symbol input needs a convention (for example, assign that symbol code `"0"`).

### 17.21 A few direct string and array patterns

These small problems illustrate how the underlying structures translate into interview solutions:

```csharp
static string LongestCommonPrefix(string[] words)
{
    if (words.Length == 0) return "";
    string prefix = words[0];
    foreach (string word in words.Skip(1))
    {
        while (!word.StartsWith(prefix, StringComparison.Ordinal))
        {
            if (prefix.Length == 0) return "";
            prefix = prefix[..^1];
        }
    }
    return prefix;
}
```
For real text, define whether comparison is case-sensitive and whether punctuation, whitespace, or Unicode normalization should be ignored; those are requirements, not assumptions the algorithms can make.
