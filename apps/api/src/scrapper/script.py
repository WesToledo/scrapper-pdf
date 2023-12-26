import sys #You will get input from node in sys.argv(list)
import json
# import pandas as pd #Import just to check if you dont have pandas module you can comment it or install pandas using pip install pandas

def add_two(a, b):
    sum = 0
    for i in range(a, b):
        sum += i
    print(sum)  

if __name__ == "__main__":
    print("Here...!")
    # print(sys.argv)
    j = json.loads(sys.argv[1]) #sys.argv[0] is filename
    print(j)
    add_two(20000, 5000000) #I make this function just to check 
# So for all print done here you will get a list for all print in node, here-> console.log(i, "---->", typeof i)