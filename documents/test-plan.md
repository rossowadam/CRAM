# Test Plan for CRAM

## Change Log

| Version | Change Date | By  | Description |
|---------|-------------|-----|-------------|
| 1.0 |Mar. 6, 2026 | Daniyal Hasnain | Initial Draft |

---

## 1. Introduction

### 1.1 Scope

Three of the five features were completed and unit tested. 

1. Account Creation
2. Course Provisioning
3. Section Management

Sprint 3 test plan will cover Global Search and Profile Management. 

#### 1.1.1 Account Creation

Account creation will be tested to verify that valid inputs (non-empty username, a valid university email domain, and a password of at least 8 characters) result in a new user being stored and a 201 response, and that invalid or duplicate inputs are correctly rejected with the appropriate HTTP error codes (403, 409, 422, 500).

#### 1.1.2 Course Provisioning

Course provisioning will be tested to verify that 



<!-- List features in scope for testing. Out-of-scope items can be noted too. -->

**In Scope:**

- 
- 
- 

**Out of Scope:**

- 
- 

### 1.2 Roles and Responsibilities

| Name | Net ID | GitHub Username | Role |
|------|--------|-----------------|------|
|      |        |                 |      |
|      |        |                 |      |
|      |        |                 |      |
|      |        |                 |      |

---

## 2. Test Methodology

### 2.1 Unit Testing

#### 2.1.1 Overview

<!-- Describe the environment and tools (e.g., Vitest, Jest) used for unit testing. -->

**Tool(s):**

**Minimum requirement:** 10 unit tests per core feature.

#### 2.1.2 Test Cases by Feature

##### Feature 1: Account Creation & Authentication

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| U-AUTH-01 | | | |
| U-AUTH-02 | | | |
| U-AUTH-03 | | | |
| U-AUTH-04 | | | |
| U-AUTH-05 | | | |
| U-AUTH-06 | | | |
| U-AUTH-07 | | | |
| U-AUTH-08 | | | |
| U-AUTH-09 | | | |
| U-AUTH-10 | | | |

##### Feature 2: Course Provisioning

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| U-COURSE-01 | | | |
| U-COURSE-02 | | | |
| U-COURSE-03 | | | |
| U-COURSE-04 | | | |
| U-COURSE-05 | | | |
| U-COURSE-06 | | | |
| U-COURSE-07 | | | |
| U-COURSE-08 | | | |
| U-COURSE-09 | | | |
| U-COURSE-10 | | | |

##### Feature 3: Section Management

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| U-SECT-01 | | | |
| U-SECT-02 | | | |
| U-SECT-03 | | | |
| U-SECT-04 | | | |
| U-SECT-05 | | | |
| U-SECT-06 | | | |
| U-SECT-07 | | | |
| U-SECT-08 | | | |
| U-SECT-09 | | | |
| U-SECT-10 | | | |

##### Feature 4: Definitions Table

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| U-DEF-01 | | | |
| U-DEF-02 | | | |
| U-DEF-03 | | | |
| U-DEF-04 | | | |
| U-DEF-05 | | | |
| U-DEF-06 | | | |
| U-DEF-07 | | | |
| U-DEF-08 | | | |
| U-DEF-09 | | | |
| U-DEF-10 | | | |

---

### 2.2 Regression Testing & CI Pipeline

#### 2.2.1 Overview

<!-- Describe how regression is triggered and what the pass condition is. -->

**CI Tool:**

**Trigger:**

**Pass Condition:**

#### 2.2.2 CI Workflow Summary

| Step | Action | Details |
|------|--------|---------|
| 1 | Trigger | |
| 2 | Install dependencies | |
| 3 | Run unit tests | |
| 4 | Report results | |

---

## 3. Terms / Acronyms

| Term / Acronym | Definition |
|----------------|------------|
| API | Application Programming Interface |
| AUT | Application Under Test |
| CI | Continuous Integration |
| CRUD | Create, Read, Update, Delete |
| SPA | Single Page Application |
| JWT | JSON Web Token |
| PR | Pull Request |
|  |  |
|  |  |