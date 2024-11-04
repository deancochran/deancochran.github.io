---
title: Designing Machine Learning Systems by Chip Huyen (A Book Review)
slug: designing-ml-systems-book-review
date: "2024-10-28"
image: /images/designing-ml-systems-book-review.webp
description: A refreshing departure from conventional ML texts, Chip Huyen's "Designing Machine Learning Systems" (2022) explores the comprehensive architecture needed to bring machine learning solutions into production, making it essential reading for both seasoned ML engineers and newcomers. It is the first book I have read by this author, and it will not be the last.
published: true
---

## Contents

## Reality Check on ML Systems

The author begins by addressing common misconceptions, noting that despite the hype, "machine learning is not a magic tool that can solve all problems." She defines an ML system as "a vague wrapping term for all the interfaces, data algorithms, infrastructure, and hardware that are used in Machine Learning applications."

> "While most of us are comfortable using a microwave without understanding how it works, many do not feel the same way about AI yet, especially if that AI makes important decisions about their lives."

## Data: The Real Game Changer

Huyen challenges the common belief that algorithmic improvements are the key to better models. Instead, she advocates for focusing on data management and quality.

### Data Engineering Components

- Different data sources (user data, system data, behavioral data)
- Storage solutions (data lakes vs. warehouses)
- Processing approaches (ETL vs. ELT)

> "The Parquet format is up to 2x faster to unload and consumes up to 6x less storage in Amazon S3, compared to text formats."

## Production Challenges and Solutions

### Distribution Shifts

The author emphasizes that data distributions inevitably change over time. Rather than trying to prevent these shifts, she advises:

> "The key is not to try to prevent all distribution shifts—which is impossible—but to build systems that can detect and adapt to these shifts as they occur."

### Model Selection Trade-offs

On choosing models for production, Huyen offers practical wisdom:

> "A slightly less accurate model that is faster, more interpretable, and easier to maintain might be a better choice for your production system than a state-of-the-art model that requires significant computational resources."

### Feature Engineering

Despite advances in deep learning, feature engineering remains crucial. The author provides compelling examples showing how features beyond raw data significantly impact model performance.

## Data Leakage: The Silent Killer

> "Data leakage can happen not only with newcomers to the field but has also happened to several experienced researchers whose work I admire, and in one of my own projects. Despite its prevalence, data leakage is rarely covered in ML curricula."

## The ML System Lifecycle

### Core Steps

1. Project scoping
2. Data engineering
3. Model development
4. Deployment
5. Performance monitoring
6. Business impact analysis

She emphasizes that this is "often times a never-ending process" with continuous iteration as technologies evolve.

## Key Requirements for Production

### Essential Components

- **Reliability**: Preventing downtime and errors
- **Scalability**: Managing computational resources efficiently
- **Maintainability**: Implementing MLOps practices
- **Adaptability**: Accommodating change without major refactoring

## Final Verdict

This book stands out for its practical, systems-level approach to machine learning. Instead of getting lost in theoretical complexities, Huyen focuses on the real challenges of building and maintaining ML systems in production. Her emphasis on data quality, system requirements, and practical trade-offs makes this an invaluable resource for anyone working on production ML systems.

The book's greatest strength lies in its honest treatment of real-world challenges and its focus on the often-overlooked aspects of ML system design. While it may not dive deeply into specific algorithms, it provides the crucial context needed to build sustainable, production-ready ML solutions.