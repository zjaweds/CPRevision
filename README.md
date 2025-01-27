# GCD and HCF Euclidean Concept

The Euclidean Algorithm is a method for finding the greatest common divisor (GCD) of two numbers. It operates on the principle that the GCD of two numbers remains the same even if the smaller number is subtracted from the larger number.

## Finding GCD using Euclidean Algorithm

To find the GCD of `n1` and `n2` where `n1 > n2`:
1. Repeatedly subtract the smaller number from the larger number until one of them becomes 0.
2. Once one of them becomes 0, the other number is the GCD of the original numbers.

![Euclidean Algorithm](https://github.com/zjaweds/CPRevision/blob/main/Images/GCD.png?raw=true)

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

## Algorithm

1. Initialize a counter variable `cnt` to count the number of factors to 0.
2. Begin a loop from 1 to the square root of `n`. This loop iterates through possible factors of `n`. For each value of `i` within the loop:
    - Check if `n` is divisible by `i` without any remainder.
    - If `n` is divisible by `i`, it means `i` is a factor of `n`, so increment the counter variable `cnt` by 1.
    - Check if the reciprocal factor of `i` i.e., `n/i` is not equal to `i`. If they are not equal, it means there is a distinct factor, so increment `cnt` by 1 again.
3. After the loop, `cnt` will contain the total number of factors of `n`.
4. Check if the value of `cnt` is exactly 2; it means that `n` has exactly two distinct factors (1 and itself), indicating that it is a prime number.
    - If the number of factors is greater than 2, then it is a composite number; return false.

# Sorting
## Selection [Programiz](https://www.programiz.com/dsa/selection-sort)
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

## Insertion
## Bubble
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

## Quick
## Merge
## Recursive Bubble
## Recursive Insertion

# Searching
## Binary Search
- Lower Bound
- Upper Bound

# Asymptotic Notation
## Master Theorem

# Recursion

# Hashing
## Hash Table

# Linkedlist

# Stack (Array & Linkedlist)

# Queue (Array & Linkedlist)
## Priority Queue

# Tree
## Binary Tree (Full, Perfect, Complete, Degenerate, Skewed, Balanced, AVL)
## Tree Traversal (Pre, In, Post)

## Binary Search Tree
