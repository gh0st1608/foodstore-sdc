Feature: Obtener lista de AllergyIntolerance

  Scenario: Buscar alergias exitosamente
    Given parámetros válidos de búsqueda
    And el repositorio retorna resultados de alergias
    When se ejecuta getCustom
    Then se retorna una respuesta con PageToken y resultados

  Scenario: Buscar alergias sin resultados
    Given parámetros válidos de búsqueda
    And el repositorio retorna una lista vacía
    When se ejecuta getCustom
    Then se retorna una respuesta con PageToken null y lista vacía
  
  Scenario: Error al buscar AllergyIntolerance
    Given parámetros válidos de búsqueda
    And el repositorio lanza un error
    When se ejecuta getCustom
    Then se debe lanzar una excepción con el mensaje esperado
