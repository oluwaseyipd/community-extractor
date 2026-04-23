# GDGoC ML Workshop — Day 1 Hands-On Exercises
### 🖥️ Google Colab Notebook Guide

> **Instructions:** Open [colab.research.google.com](https://colab.research.google.com), click **New Notebook**, and paste each exercise into a new cell. Press **Shift + Enter** to run a cell.

---

## Exercise 0 — Warm-Up: Hello, ML World!

```python
# Your very first line of code today!
print("Hello, Machine Learning World!")
print("Day 1 of my ML journey starts NOW! 🚀")
```

**Expected output:**
```
Hello, Machine Learning World!
Day 1 of my ML journey starts NOW! 🚀
```

---

## Exercise 1 — Loading Your First Dataset

The **Iris dataset** is one of the most famous datasets in Machine Learning.
It contains measurements of 150 flowers from 3 different species.

```python
# Import the tools we need
from sklearn.datasets import load_iris
import pandas as pd

# Load the Iris dataset
iris = load_iris()

# Convert it into a nice table (called a DataFrame)
df = pd.DataFrame(iris.data, columns=iris.feature_names)

# Add a column for the flower species name
df['species'] = iris.target_names[iris.target]

# Display the first 5 rows
print("First 5 rows of our dataset:")
print(df.head())
```

**Try this:** Change `df.head()` to `df.head(10)` — what happens?

---

## Exercise 2 — Exploring the Data

Understanding your data is the **first step** in any ML project.

```python
# How many rows and columns does our dataset have?
print("Dataset shape (rows, columns):", df.shape)

# How many flowers of each species are there?
print("\nFlower counts per species:")
print(df['species'].value_counts())

# Basic statistical summary
print("\nStatistical summary:")
print(df.describe())
```

**Answer these questions using the output:**
1. How many flowers are in the dataset in total?
2. Are the three species represented equally?
3. What is the average sepal length?

---

## Exercise 3 — Visualising the Data

A picture is worth a thousand rows of data!

```python
import matplotlib.pyplot as plt

# Create a scatter plot
plt.figure(figsize=(8, 5))

# Plot each species in a different colour
colors = {'setosa': 'red', 'versicolor': 'blue', 'virginica': 'green'}

for species, color in colors.items():
    subset = df[df['species'] == species]
    plt.scatter(
        subset['sepal length (cm)'],
        subset['petal length (cm)'],
        label=species,
        color=color,
        alpha=0.7
    )

plt.xlabel('Sepal Length (cm)')
plt.ylabel('Petal Length (cm)')
plt.title('Iris Flowers: Sepal vs Petal Length')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

**Observe:** Can you already see natural groupings (clusters) in the chart?
That's your eyes doing unsupervised learning! 👀

---

## Exercise 4 — Your First ML Model (Preview of Day 2!)

Let's build a simple classifier. Don't worry about understanding every line yet —
just run it and see that it works!

```python
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Features (what the model learns FROM)
X = df[['sepal length (cm)', 'sepal width (cm)',
        'petal length (cm)', 'petal width (cm)']]

# Labels (what we want to predict)
y = iris.target

# Split data: 80% for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train the model
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

# Test the model on unseen data
predictions = model.predict(X_test)

# Check how accurate it is
accuracy = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {accuracy * 100:.1f}%")
print(f"The model correctly identified {int(accuracy * len(y_test))} out of {len(y_test)} flowers!")
```

**Challenge:** What accuracy did you get? Try changing `n_neighbors=3` to `n_neighbors=5` or `n_neighbors=1`. Does accuracy change?

---

## Bonus Exercise — Predict a New Flower 🌸

```python
# Let's predict the species of a brand new flower
# with measurements the model has never seen before!

new_flower = [[5.1, 3.5, 1.4, 0.2]]  # [sepal_len, sepal_wid, petal_len, petal_wid]

prediction = model.predict(new_flower)
species_name = iris.target_names[prediction[0]]

print(f"New flower measurements: {new_flower[0]}")
print(f"Predicted species: {species_name} 🌺")
```

**Experiment:** Try changing the measurements in `new_flower`. 
- Flowers with small petals (petal_length < 2) tend to be Setosa
- Flowers with large petals (petal_length > 5) tend to be Virginica

---

## Quick Reference

| Command | What it does |
|---------|--------------|
| `df.head()` | Show first 5 rows |
| `df.shape` | (rows, columns) |
| `df.describe()` | Statistical summary |
| `df['column'].value_counts()` | Count unique values |
| `model.fit(X_train, y_train)` | Train the model |
| `model.predict(X_test)` | Make predictions |

---

## 🆘 Troubleshooting

**Red error message?** Read the very last line — that's the key clue.

**`ModuleNotFoundError`?** Run this in a new cell:
```python
!pip install scikit-learn pandas matplotlib
```

**Colab disconnected?** Click **Runtime → Reconnect**

**Output looks weird?** Try **Runtime → Restart and run all**

---

> 💡 **Keep this notebook!** Save it to your Google Drive (File → Save a copy in Drive).
> You'll build on it in Day 2 and Day 3.
