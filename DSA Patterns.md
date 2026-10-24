# DSA Problem-Solving Patterns in C#

This guide is a practical pattern reference for coding interviews. A **pattern** is a reusable way to organize a solution around the input's structure. Recognizing one helps you avoid trying every possibility.

The examples use C# and standard .NET collections. Most snippets are methods intended to be placed inside a class. Include `using System;`, `using System.Collections.Generic;`, and `using System.Linq;` as needed. The `PriorityQueue<TElement, TPriority>` examples require .NET 6 or later. The examples are for study and reference.

For a shorter recap of core data structures, complexity, and interview reminders, see the [DSA Revision Sheet](./DSA_Critical_Concepts_Revision.md).

## How to use this guide

For each problem:

1. Identify the input shape: array, string, intervals, tree, grid, or graph.
2. Identify the operation: find, count, optimize, validate, or reconstruct.
3. Look for a pattern clue below.
4. State the invariant: what does each pointer, queue, stack, or DP state mean?
5. Check preconditions and edge cases before coding.
6. Explain time and extra-space complexity.

## Pattern chooser

| Problem clue | Pattern to consider |
|---|---|
| Sorted array; pair or triple with a target | Two pointers |
| Contiguous substring/subarray; window can expand and shrink | Sliding window |
| Range totals, or count subarrays with a target sum | Prefix sum; prefix sum + frequency map |
| Cycle or midpoint in a linked list | Fast and slow pointers |
| Sorted data or monotonic yes/no condition | Binary search |
| Next greater/smaller element or nearest boundary | Monotonic stack |
| Maximum/minimum for every moving window | Monotonic deque |
| Overlapping time ranges | Merge intervals |
| Count resources over time or overlapping events | Sweep line |
| Fewest edges in an unweighted graph | BFS |
| Explore components or connected regions | DFS / flood fill |
| Prerequisite ordering | Topological sort |
| Weighted shortest path with non-negative edges | Dijkstra |
| Repeatedly need the smallest/largest item | Heap / priority queue |
| Dynamic connectivity or cycle checks in undirected edges | Disjoint Set Union |
| Repeated states with optimal substructure | Dynamic programming |
| Enumerate candidates with constraints | Backtracking |
| Prefix search over many words | Trie |
| Maximum contiguous sum | Kadane's algorithm |
| Many range additions followed by final values | Difference array |
| Values in a known range with missing/duplicate items | Cyclic placement / index mapping |
| Small set of boolean choices | Bitmask |
| Linked-list head changes or list construction | Dummy/sentinel node |

---

## 1. Two pointers

### When it fits

Use two pointers when the input is sorted, or when the problem lets you move two boundaries monotonically. Instead of checking every pair (O(n²)), use the ordering to decide which pointer to move.

### Sorted two-sum

For an ascending array, if the current sum is too small, moving the left pointer right is the only move that can increase it. If too large, moving the right pointer left is the only move that can decrease it.

```text
values = [1, 3, 4, 6, 8], target = 10
          L           R     1 + 8 = 9, too small -> L moves
             L        R     3 + 8 = 11, too large -> R moves
             L     R        3 + 6 = 9, too small -> L moves
                L  R        4 + 6 = 10, found
```

```csharp
static (int Left, int Right)? TwoSumSorted(int[] values, int target)
{
    int left = 0;
    int right = values.Length - 1;

    while (left < right)
    {
        long sum = (long)values[left] + values[right];
        if (sum == target) return (left, right);
        if (sum < target) left++;
        else right--;
    }

    return null;
}
```

- **Time:** O(n); **extra space:** O(1).
- **Precondition:** the input is sorted. If the original order must be preserved and is not sorted, use the hash-map version below.
- Return values here are indices; change the result shape if the question asks for values or all matching pairs.

### Two-sum with a hash map

For unsorted input, as each value `x` is visited, the needed complement is `target - x`. A dictionary stores previously seen values and their indices.

```text
values = [4, 7, 1, 9], target = 10
read 4 -> need 6; map {4: index 0}
read 7 -> need 3; map {4: 0, 7: 1}
read 1 -> need 9; map {4: 0, 7: 1, 1: 2}
read 9 -> need 1; found index 2 -> answer (2, 3)
```

The dictionary represents only earlier values, so each current element pairs with a distinct earlier index.

```csharp
static (int First, int Second)? TwoSum(int[] values, int target)
{
    var indexByValue = new Dictionary<int, int>();

    for (int i = 0; i < values.Length; i++)
    {
        int needed = target - values[i];
        if (indexByValue.TryGetValue(needed, out int previous))
            return (previous, i);

        indexByValue.TryAdd(values[i], i);
    }

    return null;
}
```

- **Time:** expected O(n); **extra space:** O(n).
- Check for the complement before inserting the current item so one array element is not used twice.
- The `int` subtraction can overflow for extreme values; use `long` for the target/complement if the constraints require it.

### Three-sum

Sort first, fix one value, then solve a sorted two-sum on the remaining suffix. Skip duplicate fixed values and duplicate matches if the required output is unique triplets.

```csharp
static List<int[]> ThreeSumZero(int[] input)
{
    int[] values = (int[])input.Clone();
    Array.Sort(values);
    var result = new List<int[]>();

    for (int i = 0; i < values.Length - 2; i++)
    {
        if (i > 0 && values[i] == values[i - 1]) continue;
        int left = i + 1, right = values.Length - 1;

        while (left < right)
        {
            long sum = (long)values[i] + values[left] + values[right];
            if (sum == 0)
            {
                result.Add(new[] { values[i], values[left], values[right] });
                int leftValue = values[left], rightValue = values[right];
                while (left < right && values[left] == leftValue) left++;
                while (left < right && values[right] == rightValue) right--;
            }
            else if (sum < 0) left++;
            else right--;
        }
    }

    return result;
}
```

- **Time:** O(n²) after sorting; **extra space:** depends on sorting and output.
- Use `long` for the sum when integer bounds may overflow.

### Other two-pointer variations

- **Opposite ends:** sorted pair sum, container with most water.
- **Same direction:** remove duplicates in place, partition values, merge sorted arrays.
- **Fast/slow:** linked-list cycle and midpoint (covered in Pattern 4).

---

## 2. Sliding window

A sliding window tracks a contiguous range `[left, right]`. Move `right` to include new values; move `left` to remove values that no longer satisfy the condition. When each pointer advances at most n times, the scan is O(n).

### Fixed-size window

For a window of exactly `k` values, add the new right-side value and subtract the value leaving on the left.

```text
values: [2, 1, 5, 1, 3, 2], k = 3
         [-----] sum 8
            [-----] sum 7
               [-----] sum 9  <- maximum
```

```csharp
static long MaxFixedWindowSum(int[] values, int k)
{
    if (k <= 0 || k > values.Length)
        throw new ArgumentOutOfRangeException(nameof(k));

    long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += values[i];
    long best = windowSum;

    for (int right = k; right < values.Length; right++)
    {
        windowSum += values[right] - values[right - k];
        best = Math.Max(best, windowSum);
    }

    return best;
}
```

### Variable-size window: longest substring without repeating characters

Maintain the last index of each character. On a repeat inside the current window, advance `left` past the earlier copy.

```csharp
static int LongestUniqueSubstringLength(string text)
{
    var lastSeen = new Dictionary<char, int>();
    int left = 0, best = 0;

    for (int right = 0; right < text.Length; right++)
    {
        char current = text[right];
        if (lastSeen.TryGetValue(current, out int previous))
            left = Math.Max(left, previous + 1);

        lastSeen[current] = right;
        best = Math.Max(best, right - left + 1);
    }

    return best;
}
```

```text
text:   a b c a d
window: [a b c]       repeat 'a' at index 3
move left past old a:     [b c a d]
```

### Important sliding-window caveat

The classic “shrink while sum is too large” technique generally requires **non-negative numbers**. Negative numbers can make a sum decrease when the window expands, breaking the monotonic behavior. For arbitrary integers and exact subarray-sum counts, use prefix sums with a frequency map (Pattern 3).

- **Time:** usually O(n), because both boundaries move forward at most n times.
- **Space:** O(1) for simple fixed windows; O(alphabet/map size) for distinct-character windows.

---

## 3. Prefix sums and prefix sum + hash map

Define `prefix[i]` as the sum of the first `i` values. Then inclusive range `[left, right]` has sum `prefix[right + 1] - prefix[left]`.

```text
values:  [ 4,  2,  7,  1]
prefix:  [ 0,  4,  6, 13, 14]
sum[1..3] = prefix[4] - prefix[1] = 14 - 4 = 10
```

```csharp
static long[] BuildPrefixSums(int[] values)
{
    var prefix = new long[values.Length + 1];
    for (int i = 0; i < values.Length; i++)
        prefix[i + 1] = prefix[i] + values[i];
    return prefix;
}

static long RangeSum(long[] prefix, int left, int right)
{
    if (left < 0 || right < left || right + 1 >= prefix.Length)
        throw new ArgumentOutOfRangeException();
    return prefix[right + 1] - prefix[left];
}
```

### Count subarrays whose sum equals k

If the current prefix sum is `sum`, a prior prefix of `sum - k` means the intervening subarray sums to k. A map counts how many times each prefix sum has appeared.

```text
values:          [ 2, -1,  2]
prefix sums: 0 -> 2 -> 1 -> 3
target k = 2
at prefix 3, look for earlier prefix 3 - 2 = 1
the range after that prefix sums to 2
```

The frequency map is important: the same prefix total can occur multiple times, and each occurrence represents a different possible subarray start.

```csharp
static long CountSubarraysWithSum(int[] values, long target)
{
    var frequency = new Dictionary<long, long> { [0] = 1 };
    long prefix = 0, answer = 0;

    foreach (int value in values)
    {
        prefix += value;
        answer += frequency.GetValueOrDefault(prefix - target);
        frequency[prefix] = frequency.GetValueOrDefault(prefix) + 1;
    }

    return answer;
}
```

- **Time:** expected O(n); **extra space:** O(n).
- Works with negative numbers as well as positive numbers.
- Add the current prefix to the map only after counting, so an empty subarray is not incorrectly counted for the current index.

### Difference array for many range updates

When many operations add `delta` to inclusive range `[left, right]`, mark the start with `+delta` and the position after the range with `-delta`. One final prefix scan applies all changes.

```text
Add +5 to indices [1..3]:
index:       0   1   2   3   4
change:      0  +5   0   0  -5
prefix add:  0   5   5   5   0
```

Each update becomes two boundary marks regardless of the interval length. Prefix-summing the marks reconstructs the accumulated changes.

```csharp
static long[] ApplyRangeAdds(int[] values, List<(int Left, int Right, int Delta)> updates)
{
    var difference = new long[values.Length + 1];
    foreach (int i in Enumerable.Range(0, values.Length))
        difference[i] = values[i] - (i == 0 ? 0 : values[i - 1]);

    foreach (var (left, right, delta) in updates)
    {
        difference[left] += delta;
        if (right + 1 < difference.Length) difference[right + 1] -= delta;
    }

    var result = new long[values.Length];
    long current = 0;
    for (int i = 0; i < values.Length; i++)
        result[i] = current += difference[i];
    return result;
}
```

- **Time:** O(n + q) for n elements and q range updates.
- This version assumes update indices are valid.
- For interleaved range updates and queries, consider a Fenwick tree or segment tree instead.

---

## 4. Fast and slow pointers

Move one pointer by one step and the other by two. Their relative speed reveals cycle structure without storing every visited node.

### Linked-list cycle detection

```text
1 -> 2 -> 3 -> 4
          ^    |
          |____|
slow: 1, 2, 3, 4, ...
fast: 1, 3, 3, ...    -> they meet inside a cycle
```

Why does a meeting prove a cycle? Outside a cycle, the fast pointer would reach `null`. Once both pointers are in the cycle, the fast pointer gains one node per step relative to slow, so it eventually catches up modulo the cycle length. This uses constant extra space unlike a visited-node set.

```csharp
sealed class ListNode
{
    public int Value;
    public ListNode? Next;
    public ListNode(int value, ListNode? next = null) { Value = value; Next = next; }
}

static bool HasCycle(ListNode? head)
{
    ListNode? slow = head, fast = head;
    while (fast?.Next is not null)
    {
        slow = slow!.Next;
        fast = fast.Next.Next;
        if (ReferenceEquals(slow, fast)) return true;
    }
    return false;
}
```

- **Time:** O(n); **extra space:** O(1).
- The same pointers find the middle: while `fast` and `fast.Next` exist, advance slow once and fast twice.
- For a sorted array where every value is in a constrained index/value range, “fast/slow” can also detect cycles induced by following `next = values[index]`; verify that the problem's constraints make this mapping valid.

---

## 5. Binary search

Use binary search when the search space is sorted or the answer predicate is monotonic. Prefer a half-open interval `[low, high)`: the answer, if present, remains inside it, and the empty interval is `low == high`.

### Lower bound

Find the first index `i` where `values[i] >= target`; if none exists, return `values.Length`.

```text
values = [1, 3, 3, 6, 9], target = 3
lower_bound -> index 1 (first value >= 3)
upper_bound -> index 3 (first value > 3)
```

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

### Binary search on the answer

If “feasible at capacity C” changes only from false to true as C increases, binary-search the smallest feasible C. For shipping packages in order within `days`, a candidate capacity is feasible if a greedy scan can load all packages in time.

```csharp
static int MinShipCapacity(int[] weights, int days)
{
    int low = weights.Max();
    int high = weights.Sum();

    bool Feasible(int capacity)
    {
        int usedDays = 1, currentLoad = 0;
        foreach (int weight in weights)
        {
            if (currentLoad + weight > capacity)
            {
                usedDays++;
                currentLoad = 0;
            }
            currentLoad += weight;
        }
        return usedDays <= days;
    }

    while (low < high)
    {
        int mid = low + (high - low) / 2;
        if (Feasible(mid)) high = mid;
        else low = mid + 1;
    }
    return low;
}
```

- **Time:** O(n log R), where R is the candidate answer range; **extra space:** O(1).
- The binary search is valid because higher capacity cannot make a feasible schedule infeasible.
- Use `long` for bounds and sums if input constraints could overflow `int`.

```text
capacity:  1  2  3  4  5  6  7  8
feasible:  F  F  F  T  T  T  T  T
                     ^
binary search narrows to the first feasible value
```

The hard part is usually not the binary-search loop; it is proving that the predicate is monotonic and writing a correct feasibility check.

---

## 6. Monotonic stack

A monotonic stack stores indices whose values stay increasing or decreasing. When a new value breaks the order, popped indices have just found their nearest greater/smaller answer.

### Next greater element

```text
values:      [2, 1, 5, 3]
answer:       5  5  -1 -1
stack holds indices with unresolved next-greater values.
When 5 arrives, it resolves both 2 and 1.
```

Trace: index 0 (value 2) and index 1 (value 1) are pending; value 5 is greater than both, so pop both indices and set their answer to 5. The stack retains indices in the order needed to resolve the next values.

```csharp
static int[] NextGreaterValues(int[] values)
{
    var answer = Enumerable.Repeat(-1, values.Length).ToArray();
    var stack = new Stack<int>();

    for (int i = 0; i < values.Length; i++)
    {
        while (stack.Count > 0 && values[stack.Peek()] < values[i])
            answer[stack.Pop()] = values[i];
        stack.Push(i);
    }

    return answer;
}
```

- **Time:** O(n), since each index is pushed and popped once.
- Store indices rather than values when the answer needs distances or boundaries.
- Change `<` to `<=` depending on whether “greater” means strictly greater or greater-or-equal.
- Common uses: next greater/smaller value, stock span, largest rectangle in histogram, daily temperatures.

---

## 7. Monotonic deque

For a maximum in every fixed-size window, keep indices in decreasing value order. Remove indices that leave the window from the front; remove weaker values from the back.

```text
For each right index:
  front indices outside window? remove
  back values <= new value? remove
  append right
  front is maximum for current window
```

Example for `[1, 3, -1, -3, 5]`, window size 3: the first window's deque keeps indices for values `[3, -1]`; when `5` arrives, smaller values are removed from the back, so the new front immediately gives the window maximum.

```csharp
static int[] SlidingWindowMaximum(int[] values, int k)
{
    if (k <= 0 || k > values.Length)
        throw new ArgumentOutOfRangeException(nameof(k));

    var deque = new LinkedList<int>(); // indices; front is maximum
    var result = new int[values.Length - k + 1];

    for (int right = 0; right < values.Length; right++)
    {
        while (deque.Count > 0 && deque.First!.Value <= right - k)
            deque.RemoveFirst();
        while (deque.Count > 0 && values[deque.Last!.Value] <= values[right])
            deque.RemoveLast();
        deque.AddLast(right);

        if (right >= k - 1)
            result[right - k + 1] = values[deque.First!.Value];
    }
    return result;
}
```

- **Time:** O(n); **extra space:** O(k).
- Each index enters and leaves the deque at most once.
- Use an increasing deque for window minima.

---

## 8. Merge intervals

Sort by interval start. If the next interval overlaps the current merged interval, extend its end; otherwise, emit the current interval and begin a new one.

```text
Input:  [1---3] [2-----6]       [8--10] [9---12]
Output: [1-------6]             [8-------12]
```

```csharp
static List<(int Start, int End)> MergeIntervals(List<(int Start, int End)> intervals)
{
    if (intervals.Count == 0) return new();

    var sorted = intervals.OrderBy(x => x.Start).ToList();
    var merged = new List<(int Start, int End)> { sorted[0] };

    foreach (var next in sorted.Skip(1))
    {
        var last = merged[^1];
        if (next.Start <= last.End)
            merged[^1] = (last.Start, Math.Max(last.End, next.End));
        else
            merged.Add(next);
    }
    return merged;
}
```

- **Time:** O(n log n); **space:** O(n) including output/sorted copy.
- Decide whether touching endpoints overlap (`next.Start <= last.End`) or only strict overlap counts.
- Common uses: merge calendars, insert an interval, find free time, and normalize ranges.

The invariant is that `merged` is sorted and contains no pair of overlapping adjacent intervals from the processed prefix. Sorting costs O(n log n); the merge scan itself is linear.

---

## 9. Sweep line

Turn each interval endpoint into an event, sort events by coordinate, and maintain the active count/state as the sweep moves from left to right. Tie ordering matters when interval endpoints coincide.

### Maximum number of overlapping intervals

For half-open intervals `[start, end)`, process end events before start events at the same coordinate so an interval ending at time t does not overlap one starting at t.

```text
interval A: [----)
interval B:     [----)
time:       0   1   2
At t=1, A ends before B starts for half-open intervals.
Active count changes: +1, -1, +1, -1
```

```csharp
static int MaxConcurrentIntervals(List<(int Start, int End)> intervals)
{
    var events = new List<(int Time, int Delta)>();
    foreach (var (start, end) in intervals)
    {
        events.Add((start, +1));
        events.Add((end, -1));
    }

    events.Sort((a, b) =>
    {
        int byTime = a.Time.CompareTo(b.Time);
        return byTime != 0 ? byTime : a.Delta.CompareTo(b.Delta);
    });

    int active = 0, maximum = 0;
    foreach (var e in events)
    {
        active += e.Delta;
        maximum = Math.Max(maximum, active);
    }
    return maximum;
}
```

- **Time:** O(n log n); **space:** O(n).
- For closed intervals where endpoints count as overlapping, reverse the same-time event order.
- Applications: meeting-room count, line segment intersections, skyline, and event scheduling.

---

## 10. Breadth-first search (BFS)

BFS visits vertices in increasing number of edges from the start. Mark a node visited when **enqueuing** it, not when dequeuing, so it cannot be queued repeatedly.

```text
       A                 Queue progression:
      / \                [A] -> [B,C] -> [C,D] -> ...
     B   C               distance 0: A
    /     \              distance 1: B, C
   D       E             distance 2: D, E
```

```csharp
static Dictionary<int, int> BfsDistances(
    Dictionary<int, List<int>> graph, int start)
{
    var distance = new Dictionary<int, int> { [start] = 0 };
    var queue = new Queue<int>();
    queue.Enqueue(start);

    while (queue.Count > 0)
    {
        int node = queue.Dequeue();
        if (!graph.TryGetValue(node, out var neighbors)) continue;

        foreach (int next in neighbors)
        {
            if (distance.ContainsKey(next)) continue;
            distance[next] = distance[node] + 1;
            queue.Enqueue(next);
        }
    }

    return distance;
}
```

- **Time:** O(V + E); **space:** O(V).
- BFS gives shortest paths by edge count in unweighted/equal-weight graphs.
- To reconstruct a route, store `parent[next] = node` when discovering each node.
- For disconnected graphs, start a BFS at each unvisited vertex to find every component.

### Grid BFS

Treat each passable cell as a vertex connected to its up/down/left/right neighbors. BFS is useful for shortest steps in a maze.

```text
S . # .       BFS explores all distance-1 cells before distance-2 cells.
. . # .       Walls (#) are never enqueued.
. . . G       The first time G is dequeued/discovered, its distance is shortest.
```

Store the distance when a cell is first enqueued. This doubles as the visited marker and prevents a cell from being added repeatedly.

```csharp
static int ShortestGridPath(char[][] grid, (int Row, int Col) start, (int Row, int Col) goal)
{
    int rows = grid.Length, cols = grid[0].Length;
    var distance = new int[rows, cols];
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            distance[r, c] = -1;

    var directions = new (int Dr, int Dc)[] { (-1, 0), (1, 0), (0, -1), (0, 1) };
    var queue = new Queue<(int Row, int Col)>();
    queue.Enqueue(start);
    distance[start.Row, start.Col] = 0;

    while (queue.Count > 0)
    {
        var (row, col) = queue.Dequeue();
        if ((row, col) == goal) return distance[row, col];

        foreach (var (dr, dc) in directions)
        {
            int nr = row + dr, nc = col + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] == '#' || distance[nr, nc] != -1) continue;
            distance[nr, nc] = distance[row, col] + 1;
            queue.Enqueue((nr, nc));
        }
    }
    return -1;
}
```

This assumes a non-empty rectangular grid, `'.'` for open cells, and `'#'` for blocked cells.

---

## 11. Depth-first search (DFS) and flood fill

DFS explores a branch until it cannot continue, then backtracks. Use it for reachability, components, cycle checks, and flood fill. For large graphs in C#, an explicit `Stack<T>` avoids deep recursive call stacks.

```text
      A                  One DFS route: A -> B -> D, backtrack, then C
     / \
    B   C                A stack stores the frontier; the exact order depends
   /                     on neighbor push order.
  D
```

For flood fill, each newly reached cell is recolored or marked before adding it to the stack; this prevents revisiting it through another neighbor.

### Count connected components

```csharp
static int CountComponents(Dictionary<int, List<int>> graph, int vertexCount)
{
    var visited = new bool[vertexCount];
    int components = 0;

    for (int start = 0; start < vertexCount; start++)
    {
        if (visited[start]) continue;
        components++;
        var stack = new Stack<int>();
        stack.Push(start);
        visited[start] = true;

        while (stack.Count > 0)
        {
            int node = stack.Pop();
            if (!graph.TryGetValue(node, out var neighbors)) continue;
            foreach (int next in neighbors)
                if (!visited[next])
                {
                    visited[next] = true;
                    stack.Push(next);
                }
        }
    }
    return components;
}
```

- **Time:** O(V + E); **space:** O(V).
- For a directed graph, “connected component” may mean weakly connected or strongly connected; clarify which.
- In grid flood fill, replace graph neighbors with valid adjacent cells and mark a cell before pushing it.

---

## 12. Topological sort

For a directed acyclic graph (DAG), topological order places each prerequisite before the task that depends on it. Kahn's algorithm starts with nodes of indegree zero and removes their outgoing edges.

```text
Dependencies: A -> C <- B, C -> D
Start queue: [A, B]
One valid result: A, B, C, D
```

```csharp
static List<int> TopologicalSort(Dictionary<int, List<int>> graph)
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
        int node = queue.Dequeue();
        order.Add(node);
        if (!graph.TryGetValue(node, out var neighbors)) continue;

        foreach (int next in neighbors)
            if (--indegree[next] == 0)
                queue.Enqueue(next);
    }

    if (order.Count != indegree.Count)
        throw new InvalidOperationException("The directed graph contains a cycle.");
    return order;
}
```

- **Time:** O(V + E); **space:** O(V).
- The order may not be unique.
- A cycle means there is no valid topological ordering.
- Common uses: course scheduling, build systems, dependency resolution.

---

## 13. Dijkstra's shortest path

Use Dijkstra for non-negative edge weights. A priority queue selects the currently cheapest tentative distance. When a shorter route is found, update the distance and enqueue a new candidate; ignore stale candidates later.

```text
start A
A --4-- B
 \      /
  1    2
   \  /
    C

Direct tentative distance to B = 4.
Via C gives 1 + 2 = 3, so relax dist[B] from 4 to 3.
```

“Relaxing” an edge means testing whether the path through the current vertex improves the best known distance. Non-negative weights ensure a vertex removed as the smallest current distance cannot later be improved.

```csharp
static Dictionary<int, long> Dijkstra(
    Dictionary<int, List<(int To, int Weight)>> graph, int start)
{
    var distance = new Dictionary<int, long> { [start] = 0 };
    var queue = new PriorityQueue<int, long>();
    queue.Enqueue(start, 0);

    while (queue.TryDequeue(out int node, out long cost))
    {
        if (cost != distance[node]) continue;
        if (!graph.TryGetValue(node, out var edges)) continue;

        foreach (var (next, weight) in edges)
        {
            if (weight < 0)
                throw new ArgumentException("Dijkstra requires non-negative edge weights.");

            long candidate = cost + weight;
            if (candidate >= distance.GetValueOrDefault(next, long.MaxValue)) continue;
            distance[next] = candidate;
            queue.Enqueue(next, candidate);
        }
    }
    return distance;
}
```

- **Time:** O((V + E) log V) with an adjacency list and binary heap.
- **Space:** O(V + E), including graph storage.
- Do not use Dijkstra with negative edges; choose Bellman-Ford instead.
- `PriorityQueue<TElement, TPriority>` dequeues the smallest priority first in .NET 6+.

---

## 14. Disjoint Set Union (Union-Find)

DSU tracks a changing partition of elements into groups. `Find` gets a representative; `Union` joins two groups. Path compression and union by size/rank make operations almost constant amortized time.

```text
Before union(A, B):       After union(A, B):
root A     root B         root A
  |          |           /     \
 item 1    item 2     item 1   root B
                                /   \
                             item 2 item 3
```

 The picture shows logical components, not a required exact tree shape. The representative can be any root selected by the union-by-size rule.

```csharp
sealed class DisjointSet
{
    private readonly int[] parent;
    private readonly int[] size;

    public DisjointSet(int count)
    {
        parent = Enumerable.Range(0, count).ToArray();
        size = Enumerable.Repeat(1, count).ToArray();
    }

    public int Find(int value)
    {
        if (parent[value] != value)
            parent[value] = Find(parent[value]);
        return parent[value];
    }

    public bool Union(int a, int b)
    {
        int rootA = Find(a), rootB = Find(b);
        if (rootA == rootB) return false;
        if (size[rootA] < size[rootB]) (rootA, rootB) = (rootB, rootA);
        parent[rootB] = rootA;
        size[rootA] += size[rootB];
        return true;
    }
}
```

- **Amortized time:** O(α(n)) per operation.
- **Use:** Kruskal's MST, undirected cycle detection, dynamic connectivity.
- `Union` returns false if already connected.
- Basic DSU does not support removing an edge or splitting a component.

---

## 15. Heap / priority queue for top-k

Use a heap when you repeatedly need the next minimum or maximum. For the k largest values, maintain a **min-heap of size k**: the smallest of the current top k stays at the root and is the easiest candidate to replace.

```text
values: [7, 2, 9, 4, 8], k = 3
keep a min-heap of the best 3 seen so far
after scan: heap contains {7, 9, 8}; root = 7, the smallest of the top 3
```

For each new value, insert it. If the heap now contains k+1 values, remove its minimum. The removed value cannot belong to the largest k values seen so far.

```csharp
static int[] KLargest(int[] values, int k)
{
    if (k < 0 || k > values.Length)
        throw new ArgumentOutOfRangeException(nameof(k));
    if (k == 0) return Array.Empty<int>();

    var heap = new PriorityQueue<int, int>();
    foreach (int value in values)
    {
        heap.Enqueue(value, value);
        if (heap.Count > k) heap.Dequeue();
    }
    return heap.UnorderedItems.Select(item => item.Element).ToArray();
}
```

- **Time:** O(n log k); **extra space:** O(k).
- The returned order is not sorted; sort the result if the problem requires ordering.
- A max-heap of size k instead finds the k smallest.
- For building a heap from all existing items, use bottom-up **heapify** in O(n); see the Heap properties section in [the in-depth guide](./DSA_Critical_Concepts_In_Depth.md).

---

## 16. Dynamic programming

DP fits when subproblems overlap and a state contains enough information to make the next decision. Write down:

1. **State:** what does `dp[...]` mean?
2. **Transition:** how do smaller states produce this one?
3. **Base case:** what is known without solving a smaller problem?
4. **Order:** in what order can dependencies be computed?

### One-dimensional DP: climbing stairs

If each move is one or two steps, ways to reach step `n` are ways to reach `n-1` plus ways to reach `n-2`.

```text
dp[0] = 1
dp[1] = 1
dp[n] = dp[n-1] + dp[n-2]
Only the previous two values are needed.
```

For the first few states: `dp[0]=1`, `dp[1]=1`, `dp[2]=2`, `dp[3]=3`, `dp[4]=5`. Each state depends on the two immediately smaller states, so storing the full table is unnecessary.

```

The item is either not used (`dp[cap]`) or used once (`dp[cap-weight] + value`). Descending capacity prevents the just-updated state from being reused for the same item.csharp
static long ClimbStairs(int n)
{
    if (n < 0) return 0;
    long twoBack = 1, oneBack = 1;
    for (int step = 2; step <= n; step++)
        (twoBack, oneBack) = (oneBack, twoBack + oneBack);
    return oneBack;
}
```

### 0/1 knapsack

`dp[capacity]` is the best value using items processed so far. Iterate capacities **downward**, so the current item cannot be reused in the same pass.

```csharp
static int Knapsack01(int[] weights, int[] values, int capacity)
{
    var dp = new int[capacity + 1];
    for (int item = 0; item < weights.Length; item++)
        for (int cap = capacity; cap >= weights[item]; cap--)
            dp[cap] = Math.Max(dp[cap], dp[cap - weights[item]] + values[item]);
    return dp[capacity];
}
```

- **Time:** O(number of items × capacity); **space:** O(capacity).
- Unbounded knapsack iterates capacity upward to allow item reuse.
- Other common DP states: index/capacity, pair of string prefixes (LCS/edit distance), amount (coin change), interval endpoints (interval DP).
- Complete LCS, edit-distance, and coin-change examples are in [the in-depth guide](./DSA_Critical_Concepts_In_Depth.md).

---

## 17. Backtracking

Build a candidate one decision at a time. Recurse after a choice, then undo it before exploring the next choice. Prune only when the partial candidate cannot lead to a valid answer.

### Subsets

```text
              choose item?
                /    \
            exclude  include
Each leaf is one subset; n items produce 2^n subsets.
```

At every leaf, copy the current list: later backtracking removes choices from it. Without the copy, all output entries could refer to the same mutable list.

```csharp
static List<List<int>> GenerateSubsets(int[] values)
{
    var result = new List<List<int>>();
    var current = new List<int>();

    void Search(int index)
    {
        if (index == values.Length)
        {
            result.Add(new List<int>(current));
            return;
        }

        Search(index + 1); // Exclude this value
        current.Add(values[index]);
        Search(index + 1); // Include this value
        current.RemoveAt(current.Count - 1); // Undo
    }

    Search(0);
    return result;
}
```

- **Time:** O(n × 2ⁿ), including copying output subsets.
- **Space:** O(n) recursion/current state, excluding output.
- Other uses: permutations, combinations, N-Queens, Sudoku, word search.

---

## 18. Greedy interval scheduling

Greedy makes a locally best choice and commits to it. It needs a correctness argument; an intuitive choice alone is not enough.

For maximum non-overlapping activities, sort by earliest finish time. This leaves as much remaining time as possible for future activities.

```text
time: 0----2----4----6----8----10
A:    [------]
B:         [------]
C:              [------]
D:                   [------]
Select compatible intervals in finish-time order.
```

The exchange argument: take an optimal schedule's first interval and replace it with the greedy interval that finishes earliest. The replacement finishes no later, so it leaves at least as much room for all later choices.

```csharp
static List<(int Start, int End)> SelectActivities(
    List<(int Start, int End)> intervals)
{
    var result = new List<(int Start, int End)>();
    int finish = int.MinValue;

    foreach (var interval in intervals.OrderBy(x => x.End))
    {
        if (interval.Start < finish) continue;
        result.Add(interval);
        finish = interval.End;
    }
    return result;
}
```

- **Time:** O(n log n); **space:** O(n) for the result.
- Greedy coin change is not always optimal. With coins `[1, 3, 4]` and amount 6, greedy chooses `4+1+1`, but the optimum is `3+3`.
- Explain an exchange argument or other correctness proof when claiming greedy is optimal.

---

## 19. Kadane's algorithm

Find the maximum sum of a **non-empty contiguous** subarray. At each value, either extend the best subarray ending at the previous index or start fresh at this value.

```text
bestEndingHere = max(currentValue, bestEndingHere + currentValue)
bestOverall    = max(bestOverall, bestEndingHere)
```

Example `[-2, 3, -1, 4, -5]`: the best ending sums are `-2, 3, 2, 6, 1`; the maximum seen is 6 from `[3, -1, 4]`.

```csharp
static long MaxSubarraySum(int[] values)
{
    if (values.Length == 0)
        throw new ArgumentException("Input must be non-empty.", nameof(values));

    long endingHere = values[0], best = values[0];
    for (int i = 1; i < values.Length; i++)
    {
        endingHere = Math.Max(values[i], endingHere + values[i]);
        best = Math.Max(best, endingHere);
    }
    return best;
}
```

- **Time:** O(n); **extra space:** O(1).
- Initializing from the first element handles arrays where every value is negative.
- The contiguous requirement matters; this is not the same as selecting any subset.

---

## 20. Cyclic placement / index mapping

When n values are constrained to a range such as `[1, n]`, place value `x` at index `x - 1`. A value in its correct position is skipped; otherwise swap it into its target position. This can expose missing or duplicate values in linear time.

```text
value 3 belongs at index 2:
index:  0  1  2  3
array: [3, 1, 4, 2]
swap 3 into slot 2, continue until each in-range value is at index value-1
```

Each successful swap places at least one value into its final slot, so the total number of swaps is O(n), even though the loop may revisit an index.

```csharp
static int FirstMissingPositive(int[] input)
{
    int[] values = (int[])input.Clone();
    int i = 0;

    while (i < values.Length)
    {
        int target = values[i] - 1;
        if (values[i] > 0 &&
            values[i] <= values.Length &&
            values[i] != values[target])
        {
            (values[i], values[target]) = (values[target], values[i]);
        }
        else
        {
            i++;
        }
    }

    for (i = 0; i < values.Length; i++)
        if (values[i] != i + 1) return i + 1;
    return values.Length + 1;
}
```

- **Time:** O(n) amortized; **extra space:** O(n) here because input is cloned.
- If mutation is allowed, the clone can be removed for O(1) extra space.
- The equality check prevents infinite swapping when duplicates exist.

---

## 21. Bitmask / subset enumeration

Represent whether each of n choices is selected using n bits. Bit i is set when item i belongs to the subset.

```text
mask = 0101 (binary)
bit positions 0 and 2 are set -> subset {item 0, item 2}
```

```text
bit index:  3 2 1 0
mask:       0 1 0 1
            |   |__ item 0 selected
            |______ item 2 selected
```

Check bit i with `(mask & (1 << i)) != 0`; set it with `mask | (1 << i)`; clear it with `mask & ~(1 << i)`. Enumerating all masks is useful only when n is small because it produces 2ⁿ states.

```csharp
static IEnumerable<List<int>> EnumerateSubsets(int[] values)
{
    if (values.Length >= 31)
        throw new ArgumentOutOfRangeException(nameof(values), "Use a wider mask for this example.");

    int subsetCount = 1 << values.Length;
    for (int mask = 0; mask < subsetCount; mask++)
    {
        var subset = new List<int>();
        for (int bit = 0; bit < values.Length; bit++)
            if ((mask & (1 << bit)) != 0)
                subset.Add(values[bit]);
        yield return subset;
    }
}
```

- **Time:** O(n × 2ⁿ); exponential by design.
- For n up to 64, a `ulong` may represent membership, but enumerating all subsets is still infeasible for large n.
- Common use: subset DP, visited-state masks, and small-n optimization.

---

## 22. Trie / prefix search

A trie stores one character per edge and shares common prefixes. Each terminal marker tells whether a path is a complete word or merely a prefix.

```text
Words: car, cart, cat
root
 └─ c
     └─ a
         ├─ r* ─ t*
         └─ t*
* = complete word
```

Searching `"car"` follows c-a-r and checks the terminal marker; searching prefix `"ca"` only needs to reach the node after a. Each operation costs O(word length), independent of how many words are stored (ignoring child-map overhead).

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

    public bool HasPrefix(string prefix)
    {
        TrieNode node = root;
        foreach (char c in prefix)
        {
            if (!node.Children.TryGetValue(c, out TrieNode? child)) return false;
            node = child;
        }
        return true;
    }

    public bool Contains(string word)
    {
        TrieNode node = root;
        foreach (char c in word)
        {
            if (!node.Children.TryGetValue(c, out TrieNode? child)) return false;
            node = child;
        }
        return node.IsWord;
    }
}
```

- **Time:** O(L) for a word/prefix of length L.
- **Space:** O(total characters) in the uncompressed representation.
- Common use: autocomplete, dictionary lookup, prefix filtering.

---

## 23. Dummy/sentinel node for linked lists

Use a dummy node before the real head when an operation may change the head. This makes the first node behave like every other node.

```text
dummy -> 1 -> 2 -> 3
           remove node 1 by changing dummy.Next
dummy ------> 2 -> 3
```

```csharp
static ListNode? RemoveValue(ListNode? head, int target)
{
    var dummy = new ListNode(0, head);
    ListNode current = dummy;

    while (current.Next is not null)
    {
        if (current.Next.Value == target)
            current.Next = current.Next.Next;
        else
            current = current.Next;
    }

    return dummy.Next;
}
```

- **Time:** O(n); **extra space:** O(1).
- Common use: remove nodes, merge lists, partition lists, and build a result list.

---

## 24. Matrix traversal and boundaries

For a rectangular grid, keep explicit row/column bounds and validate every neighbor before indexing. For spiral traversal, shrink the unvisited rectangle after each edge.

```text
top -> traverse right
right -> traverse down
bottom -> traverse left (if rows remain)
left -> traverse up (if columns remain)
shrink all four bounds and repeat
```

After traversing the top row or right column, a single-row/single-column remainder may be empty. Check bounds before traversing the opposite edge to avoid duplicate visits.

### Grid traversal checklist

- Is the grid empty or jagged? Guard before reading `grid[0]`.
- Are diagonal moves allowed, or only four directions?
- Is a cell marked visited when added to the worklist?
- Is the task about reachability, connected regions, or shortest path? Choose DFS for exploration or BFS for unweighted shortest distance.

For a four-direction grid, the neighbor offsets are `(-1,0), (1,0), (0,-1), (0,1)`. Add diagonals only if the problem explicitly allows them.

---

## 25. Common pattern mistakes

- Applying two pointers to unsorted data without a valid ordering argument.
- Using a variable sliding window for sums when values can be negative.
- Using Dijkstra with negative edge weights.
- Marking a BFS node visited only after dequeueing it.
- Forgetting duplicate handling in two-sum variants and three-sum.
- Using a stack of values when the answer requires indices or distances.
- Forgetting interval endpoint semantics (`[start, end]` vs `[start, end)`).
- Using upward capacity iteration for 0/1 knapsack and accidentally reusing an item.
- Omitting backtracking undo logic.
- Assuming a greedy choice is optimal without proving it.
- Reporting O(1) hash operations as a worst-case guarantee.
- Ignoring overflow in sums, products, distances, or binary-search bounds.

## Interview explanation template

> “The input has **[structure]** and asks for **[operation]**. I’ll use **[pattern]** because **[property]**. My invariant is **[invariant]**. Each element/state is processed **[number]** times, so time is **[complexity]** and auxiliary space is **[complexity]**. I’ll check **[important edge cases]**.”

Use the pattern as a starting point, not a substitute for proving correctness against the problem’s exact constraints.
