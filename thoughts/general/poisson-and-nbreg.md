---
title: Poisson and Negative Binomial Regression
author: Ciro S. Costa
date: 06 Out, 2015
---

*Poisson Regression*

:   "is a form of regression analysis used to model count data and contigency tables. Assumes the response variable $Y$ has a Poisson Distribution and that the logarithm of its expected value can be modeles by a linear combination of unknown parameters. [...] It's a form of generalized linear model with the logarithms as the link function and the Poisson distribution as the assume probability distribution of the response."

Assumes:

$$
Y \sim Poisson
$$

$$
ln(\hat{y}) = ln(\lambda i) = \alpha + \beta_1x_1 + .. + \beta_nx_n
$$


## Poisson Distribution

Discrete probability distribution of $K$ events happening in a fixed interval of time. Assumes they occur with a known average rate and independently of the time since the last occurence.

$$
f(k,\alpha) = Pr(X=k) = \frac{\lambda^ke^{\lambda}}{k!}
$$

$$
\lambda = E[X] = Var[X]
$$

Note that the case of the expected value being equal to the variance is such a rare case. Tis effect ($var > mean$) is called *overdispersion* (generally arises from the omission of relevant explanatory variables).


## Negative Binomial Distribution

Models the number of successes in a sequence of i.i.d bernoulli trials before a specified (non-random) number of failures occurs. It can be used as an alternative to the Poisson distribution when we find out that the data does not fit properly a Poisson distribution as its mean and variance turns to not be the same.


## Stata

- `poisson <variables>`
- `poisson <variables>, irr`

