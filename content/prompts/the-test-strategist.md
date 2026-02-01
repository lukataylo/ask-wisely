---
title: The Test Strategist
type: Prompts
category: Technical
shortDescription: >-
  Design comprehensive test suites using the testing pyramid and boundary
  analysis.
difficulty: Intermediate
workflow:
  - "Describe the feature you need to test, including its inputs, outputs, and dependencies"
  - "Review the testing pyramid layers and confirm coverage priorities"
  - "Write and run unit tests for the core logic first"
  - "Design integration tests with proper setup/teardown for external dependencies"
  - "Apply boundary value analysis and equivalence partitioning for edge cases"
  - "Set coverage targets per layer and add the property-based test for invariants"
skills:
  - Testing
  - QA Strategy
  - Test Design
---

Act as a QA architect. Design a testing strategy for the feature: [your feature description]. Structure your response as: 1. Identify the testing pyramid layers relevant to this feature. 2. Write unit tests for the core logic (show actual test code). 3. Design integration test scenarios with setup/teardown. 4. Identify edge cases using boundary value analysis and equivalence partitioning. 5. Write one property-based test that captures the invariant. 6. Estimate code coverage targets per layer and justify them. Think about what can go wrong at each boundary before writing tests.

<!-- variant:claude -->
Act as a QA architect. Design a testing strategy for the feature: [your feature description].

<testing-strategy>

<layer name="pyramid">
Identify the testing pyramid layers relevant to this feature. Explain why each layer matters for this specific feature.
</layer>

<layer name="unit-tests">
Write unit tests for the core logic. Show actual test code with descriptive test names. Use the AAA pattern (Arrange, Act, Assert).
</layer>

<layer name="integration-tests">
Design integration test scenarios:
- Setup/teardown requirements
- External dependency mocking strategy
- Data fixtures needed
Present each scenario with preconditions, steps, and expected outcomes.
</layer>

<layer name="edge-cases">
Identify edge cases using:
- Boundary value analysis (show the boundaries)
- Equivalence partitioning (show the partitions)
Present as a table: | Partition | Boundary | Test Case | Expected Result |
</layer>

<layer name="property-tests">
Write one property-based test that captures the core invariant of this feature. Explain what property you're testing and why it matters.
</layer>

<layer name="coverage">
Estimate code coverage targets per layer:
| Layer | Target | Justification |
</layer>

</testing-strategy>

Think about what can go wrong at each boundary before writing tests.

<!-- variant:chatgpt -->
# Testing Strategy Design

Act as a QA architect. Design a comprehensive testing strategy for: [your feature description].

Work through each layer of the testing pyramid systematically.

## 1. Testing Pyramid Analysis
Identify which layers of the testing pyramid are relevant to this feature. For each layer, explain why it matters for this specific feature.

## 2. Unit Tests
Write unit tests for the core logic. Requirements:
- Use descriptive test names that read as specifications
- Follow AAA pattern (Arrange, Act, Assert)
- Show actual runnable test code in a code block
- Cover the happy path and at least 2 failure paths

## 3. Integration Tests
Design integration test scenarios as a structured list:
- **Scenario name**
- **Setup/teardown** requirements
- **External dependencies** and how to mock them
- **Steps** to execute
- **Expected outcome**

## 4. Edge Cases
Use two techniques to find edge cases:

**Boundary Value Analysis:**
| Boundary | Below | At | Above | Expected |

**Equivalence Partitioning:**
| Partition | Representative Value | Expected Result |

## 5. Property-Based Test
Write one property-based test that captures the feature's core invariant. Explain:
- What property you're testing
- Why this property must always hold
- Show the test code

## 6. Coverage Targets
| Layer | Target % | Justification |

**Think about what can go wrong at each boundary before writing tests.**
