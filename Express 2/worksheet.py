class Solution(object):
    def fizzBuzz(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        out = []
        for num in range(1, n+1):
            if num % 3 == 0 and num % 5 == 0:
                out.append("FizzBuzz")
                continue
            if num % 3 == 0:
                out.append('Fizz')
                continue
            if num % 5 == 0:
                out.append('Buzz')
                continue
            out.append(str(num))
            
        return out