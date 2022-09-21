import mysql.connector
import pandas as pd 
import requests

my_conn = mysql.connector.connect(
      host="172.19.0.2",
      user="root",
      passwd="root",
      database="booki"
    )
####### end of connection ####
my_data = pd.read_sql("SELECT * FROM hotel",my_conn)
print(my_data)