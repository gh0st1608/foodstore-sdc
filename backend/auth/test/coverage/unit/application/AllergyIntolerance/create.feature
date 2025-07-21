Feature: Crear un AllergyIntolerance

  Scenario: Crear una nueva AllergyIntolerance exitosamente
    Given una solicitud válida para crear un AllergyIntolerance
    When ejecuto el método create
    Then debo recibir un mensaje de éxito con el ID generado

  Scenario: Error al crear un AllergyIntolerance
    Given una solicitud válida para crear un AllergyIntolerance
    When ejecuto el método create y ocurre un error en la infraestructura
    Then debo recibir una excepción lanzada por la aplicación
