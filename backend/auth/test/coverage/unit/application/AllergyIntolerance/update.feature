Feature: Actualizar un AllergyIntolerance

  Scenario: Actualiza un AllergyIntolerance exitosamente
    Given un ID válido de AllergyIntolerance y nuevos datos
    When ejecuto el método update
    Then debe retornar un mensaje de éxito con el ID

  Scenario: Error al actualizar un AllergyIntolerance
    Given un ID válido de AllergyIntolerance y nuevos datos
    When ejecuto el método update y ocurre un error en la infraestructura
    Then debo recibir una excepción lanzada por la aplicación