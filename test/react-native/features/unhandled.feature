Feature: Reporting unhandled errors

Scenario: Catching an Unhandled Native error
  When I run "UnhandledNativeErrorScenario" and relaunch the crashed app
  And I configure Bugsnag for "UnhandledNativeErrorScenario"
  Then I wait to receive an error
  And the event "exceptions.0.errorClass" equals the platform-dependent string:
  | android | java.lang.RuntimeException |
  | ios     | NSException                |
  And the event "exceptions.0.type" equals the platform-dependent string:
  | android | android |
  | ios     | cocoa   |
  And the event "unhandled" is true
  And the exception "message" equals "UnhandledNativeErrorScenario"

Scenario: Updating severity on an unhandled JS error
  When I run "UnhandledJsErrorSeverityScenario" and relaunch the crashed app
  And I configure Bugsnag for "UnhandledJsErrorSeverityScenario"
  Then I wait to receive an error
  And the exception "errorClass" equals "Error"
  And the exception "message" equals "UnhandledJsErrorSeverityScenario"
  And the event "unhandled" is true
  And the event "severity" equals "info"

  Scenario: Updating severity on an unhandled JS error
    When I run "UnhandledJsErrorSeverityScenario" and relaunch the crashed app
    And I configure Bugsnag for "UnhandledJsErrorSeverityScenario"
    Then I wait to receive an error
    And the exception "errorClass" equals "Error"
    And the exception "message" equals "UnhandledJsErrorSeverityScenario"
    And the event "unhandled" is true
    And the event "severity" equals "info"

  Scenario: Updating severity on an unhandled JS error
    When I run "UnhandledJsErrorSeverityScenario" and relaunch the crashed app
    And I configure Bugsnag for "UnhandledJsErrorSeverityScenario"
    Then I wait to receive an error
    And the exception "errorClass" equals "Error"
    And the exception "message" equals "UnhandledJsErrorSeverityScenario"
    And the event "unhandled" is true
    And the event "severity" equals "info"

  Scenario: Updating severity on an unhandled JS error
    When I run "UnhandledJsErrorSeverityScenario" and relaunch the crashed app
    And I configure Bugsnag for "UnhandledJsErrorSeverityScenario"
    Then I wait to receive an error
    And the exception "errorClass" equals "Error"
    And the exception "message" equals "UnhandledJsErrorSeverityScenario"
    And the event "unhandled" is true
    And the event "severity" equals "info"

  Scenario: Updating severity on an unhandled JS error
    When I run "UnhandledJsErrorSeverityScenario" and relaunch the crashed app
    And I configure Bugsnag for "UnhandledJsErrorSeverityScenario"
    Then I wait to receive an error
    And the exception "errorClass" equals "Error"
    And the exception "message" equals "UnhandledJsErrorSeverityScenario"
    And the event "unhandled" is true
    And the event "severity" equals "info"
