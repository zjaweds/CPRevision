# Asymptotic Notation
## [Master Theorem](https://www.programiz.com/dsa/master-theorem)
## [Amortized Time Complexity](https://stackoverflow.com/questions/15079327/amortized-complexity-in-laymans-terms)
### [Naukri.com](https://www.naukri.com/code360/library/amortized-time-complexity-in-data-structures)


# GCD and HCF Euclidean Concept

The Euclidean Algorithm is a method for finding the greatest common divisor (GCD) of two numbers. It operates on the principle that the GCD of two numbers remains the same even if the smaller number is subtracted from the larger number.

## Finding GCD using Euclidean Algorithm

To find the GCD of `n1` and `n2` where `n1 > n2`:
1. Repeatedly subtract the smaller number from the larger number until one of them becomes 0.
2. Once one of them becomes 0, the other number is the GCD of the original numbers.

![Euclidean Algorithm](https://github.com/zjaweds/CPRevision/blob/main/Images/GCD.png?raw=true)
[Source](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2)

**Example:**

n1 = 20, n2 = 15 gcd(20, 15) = gcd(20-15, 15) = gcd(5, 15) gcd(5, 15) = gcd(15-5, 5) = gcd(10, 5) gcd(10, 5) = gcd(10-5, 5) = gcd(5, 5) gcd(5, 5) = gcd(5-5, 5) = gcd(0, 5) Hence, return 5 as the gcd.


# Divisor Related Theorems

We can optimize the previous approach by using the property that for any non-negative integer `n`, if `d` is a divisor of `n`, then `n/d` is also a divisor of `n`. This property is symmetric about the square root of `n`. By traversing just the first half, we can avoid redundant iteration and computations, improving the efficiency of the algorithm.

## Algorithm
1. Initialize an array to store the divisors.
2. Iterate from 1 to the square root of `n` using a loop variable `i`. For each value of `i`:
    - Check if `i` is a divisor of `n` by checking if `n` is divisible by `i` without a remainder (`n % i == 0`).
    - If `i` is a divisor, add it to the vector of divisors.
    - If `i` is different from `n/i`, add the counterpart divisor `n/i` to the vector of divisors.
3. After the loop, return the array of divisors.

# Checking Prime

## Algorithm / Intuition

We can optimize the algorithm by only iterating up to the square root of `n` when checking for factors. This is because if `n` has a factor greater than its square root, it must also have a factor smaller than its square root. This property is symmetric about the square root of `n`. By traversing just the first half, we can avoid redundant iteration and computations, improving the efficiency of the algorithm.

![Divisor Theorem](https://github.com/zjaweds/CPRevision/blob/main/Images/Prime.png?raw=true)
[Source](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2)
## Algorithm

1. Initialize a counter variable `cnt` to count the number of factors to 0.
2. Begin a loop from 1 to the square root of `n`. This loop iterates through possible factors of `n`. For each value of `i` within the loop:
    - Check if `n` is divisible by `i` without any remainder.
    - If `n` is divisible by `i`, it means `i` is a factor of `n`, so increment the counter variable `cnt` by 1.
    - Check if the reciprocal factor of `i` i.e., `n/i` is not equal to `i`. If they are not equal, it means there is a distinct factor, so increment `cnt` by 1 again.
3. After the loop, `cnt` will contain the total number of factors of `n`.
4. Check if the value of `cnt` is exactly 2; it means that `n` has exactly two distinct factors (1 and itself), indicating that it is a prime number.
    - If the number of factors is greater than 2, then it is a composite number; return false.


# Recursion


# Sorting
## [Selection Sort Programiz](https://www.programiz.com/dsa/selection-sort)
**Selection sort is a sorting algorithm that selects the smallest element from an unsorted list in each iteration and places that element at the beginning of the unsorted list.**
1. Set the first element as `minimum`
2. a. Compare `minimum` with the second element. If the second element is smaller than `minimum`, assign the second element as `minimum`.
   b. Compare `minimum` with the third element. Again, if the third element is smaller, then assign `minimum` to the third element otherwise do nothing. The process goes on until the last element.
3. After each iteration, `minimum` is placed in the front of the unsorted list.
4. For each iteration, indexing starts from the first unsorted element. Step 1 to 3 are repeated until all the elements are placed at their correct positions.
```
def selectionSort(array, size):
    for step in range(size):
        min_idx = step
        for i in range(step + 1, size):
            # to sort in descending order, change > to < in this line
            # select the minimum element in each loop
            if array[i] < array[min_idx]:
                min_idx = i
        # put min at the correct position (swapping step)
        (array[step], array[min_idx]) = (array[min_idx], array[step])
```

## [Insertion Sort Programiz](https://www.programiz.com/dsa/insertion-sort)
- **Insertion sort is a sorting algorithm that places an unsorted element at its suitable place in each iteration.**
### Algorithm
1. a. The first element in the array is assumed to be sorted. Take the second element and store it separately in key.
   
   b. Compare key with the first element. If the first element is greater than key, then key is placed in front of the first element.
3. Now, the first two elements are sorted. Take the third element and compare it with the elements on the left of it. Placed it just behind the element smaller than it. If there is no element smaller than it, then place it at the beginning of the array.
4. Similarly, place every unsorted element at its correct position.
```
def insertionSort(array):
    for step in range(1, len(array)):
        key = array[step]
        j = step - 1
        # Compare key with each element on the left of it until an element smaller than it is found
        # For descending order, change key<array[j] to key>array[j].        
        while j >= 0 and key < array[j]:
            array[j + 1] = array[j]
            j = j - 1
        # Place key at after the element just smaller than it.
        array[j + 1] = key
```

## [Bubblesort Programiz](https://www.programiz.com/dsa/bubble-sort)
- **Just like the movement of air bubbles in the water that rise up to the surface, each element of the array move to the end in each iteration. Therefore, it is called a bubble sort.**
- **In Bubblesort, it compares two adjacent element and swaps them until they are in the intended order**
- After each iteration an element reaches at the intnded position- in case of ascending order largest element reaches the last position in first iteration and second largest element reaches the second last position in second iteration and so on but in descending order smallest element reaches the last position in first iteration and the second smallest element reaches the second last element and so on
### Code

```
def bubbleSort(array):
    
  # loop to access each array element
  for i in range(len(array)):

    # loop to compare array elements
    for j in range(0, len(array) - i - 1):

      # compare two adjacent elements
      # change > to < to sort in descending order
      if array[j] > array[j + 1]:

        # swapping elements if elements
        # are not in the intended order
        temp = array[j]
        array[j] = array[j+1]
        array[j+1] = temp
```
![Bubblesort 1](https://github.com/zjaweds/CPRevision/blob/main/Images/Bubblesort1.png?raw=true)

![Bubblesort 2](https://github.com/zjaweds/CPRevision/blob/main/Images/Bubblesort2.png?raw=true)

![Bubblesort 3](https://github.com/zjaweds/CPRevision/blob/main/Images/Bubblesort3.png?raw=true)

![Bubblesort 4](https://github.com/zjaweds/CPRevision/blob/main/Images/Bubblesort4.png?raw=true)

## [Quicksort Programiz](https://www.programiz.com/dsa/quick-sort)

In **Quicksort**, we select a pivot and divide the array at left and the array at right of the pivot **recursively**, we call this process **Partition, here we select a pivot and at the end of the function the pivot reaches its actual position in the array when it would be sorted**.
In **Partions**, we select a pivot and then we take two pinters one at the starting index (i, assumption) and another at the end of the array (j, assumption) and we perform following operations
 1. We increase i as long as the ith element is smaller than or equal to pivot
 2. We decrease j as long as jth element is greater than pivot
 3. if both of them have not met yet we swap ith and jth elements
 4. if they (i, j) have met or crossed each other we swap the jth element with pivot and return j

**Quicksort Function**
```
void Quicksort(vector<int> &arr, int low, int high) {
    if (low < high) {
        int pIndex = partition(arr, low, high);
        Quicksort(arr, low, pIndex - 1);
        Quicksort(arr, pIndex + 1, high);
    }
}
```

**Partition Function**
```
int partition(arr, low, high){
    pivot = arr[low];
    i = low;
    j = high;
    while(i<j){
        while(arr[i] <= pivot && i < high){
            i++;
        }
        while(arr[j] > pivot && j > low){
            j--;
        }
        if(i < j) swap(arr[i], arr[j]);
    }
    swap(arr[low], arr[j]);
    return j;
}
```

## [Mergesort Programiz](https://www.programiz.com/dsa/merge-sort)
**In Mergesort we divide the array into two halves recursively as long as there is no division possible and then we compare and merge two divided arrays**
```
class Solution {
  public:
    void merge(vector<int>& arr, int m, int l, int r){
        vector<int>temp;
        int right=m+1;
        int left=l;
        // Sorting two halves
        while(left<=m && right<=r){
            if(arr[left]<=arr[right]){
                temp.push_back(arr[left]);
                left++;
            }else{
                temp.push_back(arr[right]);
                right++;
            }
        }
        // Remaining elements in first half
        while(left<=m){
            temp.push_back(arr[left]);
            left++;
        }
        // Remaining elements in second half
        while(right<=r){
            temp.push_back(arr[right]);
            right++;
        }
        // All elements of temporary array being assigned to the original array
        for(int i=l; i<=r; i++){
            arr[i]=temp[i-l];
        }
    }
    void mergeSort(vector<int>& arr, int l, int r) {
        if(r<=l) return; // Base case
        int m=l+(r-l)/2; // Mid point
        // mergeSort(first half);
        mergeSort(arr, l, m);
        // mergeSort(second half)
        mergeSort(arr, m+1, r);
        //merge(first and second halves)
        merge(arr, m, l, r);
    }
};
```
## Recursive Bubblesort
## Recursive Insertion Sort

# Searching
## [Binary Search](https://www.programiz.com/dsa/binary-search)
There are two approaches of solving this problem, it works only on a **sorted** array.

**1. Iterative**
 
```
    do until the pointers low and high meet each other.
        mid = (low + high)/2
        if (x == arr[mid])
            return mid
        else if (x > arr[mid]) // x is on the right side
            low = mid + 1
        else                       // x is on the left side
            high = mid - 1
```
    
 **2. Recursive**
    
    It follows divide and conquer approach, we get the middle element and we compare it with the element 
    that we have to find, if it is same then we return the middle index, if it is smaller than the middle
    element we search in first half else if it is greater than the middle element we search in the second
    half, recursively.
    
```
    binarySearch(arr, x, low, high)
        if low > high
            return False 
        else
            mid = (low + high) / 2 
            if x == arr[mid]
                return mid
            else if x > arr[mid]        // x is on the right side
                return binarySearch(arr, x, mid + 1, high)
            else                               // x is on the left side
                return binarySearch(arr, x, low, mid - 1)
```
    
- Lower Bound
- Upper Bound

# Hashing
## Hash Table

# Linkedlist

# Stack (Array & Linkedlist)

# Queue (Array & Linkedlist)
```
using System;

public class CircularQueue<T>
{
    private T[] elements;
    private int front;
    private int rear;
    private int max;

    public CircularQueue(int size)
    {
        elements = new T[size];
        front = -1;
        rear = -1;
        max = size;
    }

    public void Enqueue(T item)
    {
        if ((rear + 1) % max == front)
        {
            Console.WriteLine("Queue is full");
            return;
        }

        if (front == -1)
        {
            front = 0;
        }

        rear = (rear + 1) % max;
        elements[rear] = item;
    }

    public T Dequeue()
    {
        if (front == -1)
        {
            Console.WriteLine("Queue is empty");
            return default(T);
        }

        T item = elements[front];
        if (front == rear)
        {
            front = -1;
            rear = -1;
        }
        else
        {
            front = (front + 1) % max;
        }
        return item;
    }

    public bool IsEmpty()
    {
        return front == -1;
    }

    public bool IsFull()
    {
        return (rear + 1) % max == front;
    }

    public int Size()
    {
        if (front == -1)
        {
            return 0;
        }
        else if (rear >= front)
        {
            return rear - front + 1;
        }
        else
        {
            return max - front + rear + 1;
        }
    }
}

class Program
{
    static void Main()
    {
        CircularQueue<int> queue = new CircularQueue<int>(5);

        queue.Enqueue(1);
        queue.Enqueue(2);
        queue.Enqueue(3);
        queue.Enqueue(4);
        queue.Enqueue(5);

        Console.WriteLine("Queue size: " + queue.Size());

        while (!queue.IsEmpty())
        {
            Console.WriteLine(queue.Dequeue());
        }

        Console.WriteLine("Queue size: " + queue.Size());
    }
}


```
## Priority Queue

# Tree
A nonlinear hierarchical data structure comprising `Nodes` connected by `Edges`.

**Node**: A node is an entity that contains data and pointers to its children nodes.

![Edge and Node](https://github.com/zjaweds/CPRevision/blob/main/Images/Edge.png?raw=true)

- The last nodes of each path are called **Leaf Nodes** or external nodes that do not contain a pointer to child nodes.
- The node having at least a child node is called an **Internal Node**.
- **The Height** of a node is the number of edges from the node to the deepest leaf (ie. the **longest path from the node to a leaf node**).
- **The Depth** of a node is the number of edges from the root to the node.
- The height of a Tree is the height of the root node or the depth of the deepest node.

![Height and Depth](https://github.com/zjaweds/CPRevision/blob/main/Images/Height.png?raw=true)
  
## Binary Tree (Full, Perfect, Complete, Degenerate, Skewed, Balanced, AVL)
## Tree Traversal (Pre, In, Post)

# Breadth First Search

```
using System;

public class CircularQueue
{
    private int[] elements;
    private int front;
    private int rear;
    private int max;

    public CircularQueue(int size)
    {
        elements = new int[size];
        front = -1;
        rear = -1;
        max = size;
    }

    public void Enqueue(int item)
    {
        if ((rear + 1) % max == front)
        {
            Console.WriteLine("Queue is full");
            return;
        }

        if (front == -1)
        {
            front = 0;
        }

        rear = (rear + 1) % max;
        elements[rear] = item;
    }

    public int Dequeue()
    {
        if (front == -1)
        {
            Console.WriteLine("Queue is empty");
            return -1; // Assuming -1 indicates an empty queue
        }

        int item = elements[front];
        if (front == rear)
        {
            front = -1;
            rear = -1;
        }
        else
        {
            front = (front + 1) % max;
        }
        return item;
    }

    public bool IsEmpty()
    {
        return front == -1;
    }

    public bool IsFull()
    {
        return (rear + 1) % max == front;
    }
}

public class Node
{
    public int data;
    public Node left, right;

    public Node(int item)
    {
        data = item;
        left = right = null;
    }
}

public class BinaryTree
{
    public Node root;

    public void BFS(Node root)
    {
        if (root == null)
        {
            return;
        }

        CircularQueue queue = new CircularQueue(100); // Assuming a max size of 100 for the queue
        queue.Enqueue(root.data);

        while (!queue.IsEmpty())
        {
            int nodeValue = queue.Dequeue();
            Console.Write(nodeValue + " ");

            // Find the node corresponding to nodeValue
            Node node = FindNode(root, nodeValue);
            
            if (node.left != null)
            {
                queue.Enqueue(node.left.data);
            }

            if (node.right != null)
            {
                queue.Enqueue(node.right.data);
            }
        }
    }

    private Node FindNode(Node root, int value)
    {
        if (root == null || root.data == value)
        {
            return root;
        }

        Node leftResult = FindNode(root.left, value);
        return leftResult != null ? leftResult : FindNode(root.right, value);
    }
}

class Program
{
    static void Main()
    {
        BinaryTree tree = new BinaryTree();
        tree.root = new Node(1);
        tree.root.left = new Node(2);
        tree.root.right = new Node(3);
        tree.root.left.left = new Node(4);
        tree.root.left.right = new Node(5);
        tree.root.right.left = new Node(6);
        tree.root.right.right = new Node(7);

        Console.WriteLine("Breadth-First Search (BFS) traversal of the binary tree:");
        tree.BFS(tree.root);
    }
}

```

# Levelorder Traversal

```
using System;

public class CircularQueue
{
    private Node[] elements;
    private int front;
    private int rear;
    private int max;

    public CircularQueue(int size)
    {
        elements = new Node[size];
        front = -1;
        rear = -1;
        max = size;
    }

    public void Enqueue(Node item)
    {
        if ((rear + 1) % max == front)
        {
            Console.WriteLine("Queue is full");
            return;
        }

        if (front == -1)
        {
            front = 0;
        }

        rear = (rear + 1) % max;
        elements[rear] = item;
    }

    public Node Dequeue()
    {
        if (front == -1)
        {
            Console.WriteLine("Queue is empty");
            return null; // Assuming null indicates an empty queue
        }

        Node item = elements[front];
        if (front == rear)
        {
            front = -1;
            rear = -1;
        }
        else
        {
            front = (front + 1) % max;
        }
        return item;
    }

    public bool IsEmpty()
    {
        return front == -1;
    }

    public bool IsFull()
    {
        return (rear + 1) % max == front;
    }
}

public class Node
{
    public int data;
    public Node left, right;

    public Node(int item)
    {
        data = item;
        left = right = null;
    }
}

public class BinaryTree
{
    public Node root;

    public void LevelOrderTraversal(Node root)
    {
        if (root == null)
        {
            return;
        }

        CircularQueue queue = new CircularQueue(100); // Assuming a max size of 100 for the queue
        queue.Enqueue(root);

        while (!queue.IsEmpty())
        {
            int levelNodeCount = CalculateLevelNodeCount(queue);
            
            while (levelNodeCount > 0)
            {
                Node node = queue.Dequeue();
                Console.Write(node.data + " ");

                if (node.left != null)
                {
                    queue.Enqueue(node.left);
                }

                if (node.right != null)
                {
                    queue.Enqueue(node.right);
                }

                levelNodeCount--;
            }

            Console.WriteLine();
        }
    }

    private int CalculateLevelNodeCount(CircularQueue queue)
    {
        int count = 0;
        int originalFront = queue.front;

        while (originalFront != queue.rear)
        {
            count++;
            originalFront = (originalFront + 1) % queue.max;
        }

        count++; // To include the rear element
        return count;
    }
}

class Program
{
    static void Main()
    {
        BinaryTree tree = new BinaryTree();
        tree.root = new Node(1);
        tree.root.left = new Node(2);
        tree.root.right = new Node(3);
        tree.root.left.left = new Node(4);
        tree.root.left.right = new Node(5);
        tree.root.right.left = new Node(6);
        tree.root.right.right = new Node(7);

        Console.WriteLine("Level Order Traversal of the binary tree:");
        tree.LevelOrderTraversal(tree.root);
    }
}


```


## Binary Search Tree
