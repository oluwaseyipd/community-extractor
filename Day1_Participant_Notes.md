# GDGoC ML Workshop — Day 1 Participant Notes
### Introduction to Machine Learning

**Workshop:** GDGoC ML Workshop | **Day:** 1 of 3 | **Your Name:** _______________

---

## What is Machine Learning?

**Definition:**
> Machine Learning is a branch of Artificial Intelligence that gives computers the ability to **learn from data** and improve their performance **without being explicitly programmed**.

### Traditional Programming vs Machine Learning

| Traditional Programming | Machine Learning |
|------------------------|------------------|
| Developer writes rules | Model learns rules from data |
| Computer follows fixed instructions | Computer improves with more data |
| Hard to adapt to new patterns | Naturally adapts as patterns change |
| Example: `if subject == "FREE MONEY" → spam` | Example: Learns spam patterns from 10,000 examples |

**In your own words — write down what ML means to you:**

_____________________________________________________________________________

_____________________________________________________________________________

---

## ML in Everyday Life

ML is already part of technologies you use every day:

| Technology | How ML is Used |
|------------|----------------|
| 🎬 Netflix / YouTube | Recommends content based on your watch history |
| 📧 Gmail | Detects and filters spam before you see it |
| 🎵 Spotify | Groups users by taste to suggest music |
| 🔍 Google Search | Ranks results based on relevance to your query |
| 🏦 Banking Apps | Flags unusual transactions as potential fraud |
| 🗣️ Siri / Google Assistant | Understands natural speech and intent |

**Can you think of one more example you've encountered?**

_____________________________________________________________________________

---

## Types of Machine Learning

### 1. Supervised Learning

**The key idea:** Training data comes with **labels** (correct answers).

```
Input: [Photo of a cat]  →  Label: "Cat"
Input: [Photo of a dog]  →  Label: "Dog"
Input: [New photo?]      →  Model predicts: "Cat" ✓
```

**Two types of Supervised Learning:**

| Type | Output | Example |
|------|--------|---------|
| **Classification** | A category / class | Spam or Not Spam, Sick or Healthy |
| **Regression** | A number | House price, Tomorrow's temperature |

**Analogy:** Like studying with a textbook that has the answer key. You see the question and the answer, learn the pattern, then answer new questions on your own.

---

### 2. Unsupervised Learning

**The key idea:** Training data has **no labels**. The model discovers patterns on its own.

```
Input: [1000 customer profiles, no labels]
Model finds groups: Budget shoppers | Brand loyalists | Bargain hunters
```

**Two common types:**

| Type | What it does | Example |
|------|-------------|---------|
| **Clustering** | Groups similar items together | Customer segmentation, News topic grouping |
| **Dimensionality Reduction** | Compresses data, keeps important parts | Feature extraction, Data visualisation |

**Analogy:** Like sorting a pile of unsorted photos into albums without anyone telling you the categories — you discover the groupings yourself.

---

### Quick Comparison

| | Supervised | Unsupervised |
|-|------------|--------------|
| **Data** | Labelled | Unlabelled |
| **Goal** | Predict known outputs | Discover hidden patterns |
| **Complexity** | Easier to evaluate | Harder to evaluate |
| **Example** | Email spam filter | Customer clustering |

---

## Tools We Use

### Python 🐍
- Most popular language for data science and ML
- Beginner-friendly syntax — reads almost like English
- **Tip:** You don't need to master Python first; learn as you go

### Google Colab 💻
- Free cloud-based notebook (runs in your browser)
- No installation required — just a Google account
- All ML libraries come pre-installed
- **Access:** `colab.research.google.com`

### Key Python Libraries

| Library | Purpose | Import |
|---------|---------|--------|
| **NumPy** | Fast number crunching | `import numpy as np` |
| **Pandas** | Data tables and analysis | `import pandas as pd` |
| **Matplotlib** | Charts and visualisations | `import matplotlib.pyplot as plt` |
| **Scikit-learn** | ML models and algorithms | `from sklearn import ...` |

---

## Today's Code — Quick Reference

```python
# Load a dataset
from sklearn.datasets import load_iris
import pandas as pd

iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df['species'] = iris.target_names[iris.target]

# Explore
print(df.head())           # First 5 rows
print(df.shape)            # (150, 5)
print(df.describe())       # Statistics summary

# Train a model
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

X = df[iris.feature_names]
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)
```

---

## Key Terms Glossary

| Term | Definition |
|------|------------|
| **Artificial Intelligence (AI)** | Broad field of making computers perform intelligent tasks |
| **Machine Learning (ML)** | Subset of AI; systems that learn from data |
| **Dataset** | A collection of data used to train or test a model |
| **Features** | Input variables the model learns from (e.g., petal length) |
| **Label / Target** | The output variable we want to predict (e.g., flower species) |
| **Training** | The process of a model learning patterns from data |
| **Model** | The mathematical system that makes predictions |
| **Accuracy** | Percentage of predictions the model got right |
| **Supervised Learning** | Learning from labelled data (input + correct answer) |
| **Unsupervised Learning** | Learning from unlabelled data to find hidden patterns |
| **Classification** | Predicting a category (e.g., cat vs dog) |
| **Regression** | Predicting a number (e.g., price, temperature) |
| **Clustering** | Grouping similar data points together |
| **DataFrame** | A table structure in Pandas for organising data |

---

## Notes & Questions

_Use this space during the session:_

_____________________________________________________________________________

_____________________________________________________________________________

_____________________________________________________________________________

_____________________________________________________________________________

_____________________________________________________________________________

---

## Practice Before Day 2

- [ ] Save your Colab notebook to Google Drive
- [ ] Run all exercises from today at least once more
- [ ] Change the `n_neighbors` value in Exercise 4 and observe the effect
- [ ] Try loading a different dataset: `from sklearn.datasets import load_wine`
- [ ] Watch: "Machine Learning for Everybody" by freeCodeCamp (YouTube, free)

---

## Resources

| Resource | Link |
|----------|------|
| Google Colab | colab.research.google.com |
| Scikit-learn Docs | scikit-learn.org/stable |
| Kaggle (free datasets) | kaggle.com |
| Machine Learning Crash Course | developers.google.com/machine-learning/crash-course |

---

*GDGoC ML Workshop — Day 1 of 3*
*Day 2: Building Your First ML Model | Day 3: Real Projects & Beyond*
