# EDA Plan and Code Snippets

## EDA Questions
1. What is congestion class distribution?
2. How do traffic volume and speed interact?
3. Which zones have most High/Very High events?
4. What time windows drive congestion peaks?
5. How do weather and rainfall affect risk?
6. What is accident/event uplift impact?
7. Does higher public transport density reduce congestion?
8. Which map cells are persistent hotspots?

## Python EDA Starter
```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('backend/data/sample_traffic.csv')
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df['hour'] = df['Timestamp'].dt.hour

sns.countplot(data=df, x='Congestion Level')
plt.show()

sns.scatterplot(data=df, x='Traffic Volume', y='Average Speed (km/h)', hue='Congestion Level', alpha=0.5)
plt.show()

zone = df[df['Congestion Level'].isin(['High','Very High'])]['Location'].value_counts().head(10)
zone.plot(kind='bar')
plt.show()
```
