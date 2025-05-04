# Manacher’s Algorithm

## Introduction
Manacher's algorithm efficiently finds the **longest palindromic substring** in a given string. It plays a crucial role in solving sub-problems of complex computational challenges. 

### Problem Statement
Given a string **s** of length **n**, find the longest palindromic substring.

A string is considered a palindrome if it remains unchanged when reversed.

## Algorithm Overview
Manacher’s algorithm was initially designed to list all palindromes at the start of a string but later adapted for finding **longest palindromic substrings in linear time**. 

This algorithm outperforms brute-force methods by leveraging the idea that **palindromes nest within other palindromes**.

### Preprocessing Trick
To handle **even-length palindromes**, we modify the input string by inserting `#` at alternating positions.

Example:  
Original: `"abcaac"`  
Transformed: `"#a#b#c#a#a#c#"`

This transformation ensures uniform handling of **odd** and **even-length palindromes**.

## Steps of Manacher’s Algorithm
1. **Modify the input string** by inserting special characters (`#`) and adding boundary markers (`@`, `$`).
2. **Declare necessary variables**:
   - Maximum detected palindrome length.
   - Position from where to begin searching.
   - Rightmost boundary of detected palindromes.
   - Center of the current palindrome.
3. **Iterate over the modified string**, expanding palindromes while utilizing symmetry properties.
4. **Update center position and max length dynamically** as larger palindromes are found.
5. **Extract and return the longest palindromic substring** from the original string.
