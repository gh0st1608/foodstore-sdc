Feature: Obtener AllergyIntolerance por ID

  Scenario: Obtener un AllergyIntolerance existente y activo
    Given un ID válido de AllergyIntolerance
    When se llama a getById con ese ID
    Then se debe retornar el recurso con mensaje de éxito

  Scenario: Falla al obtener AllergyIntolerance inexistente
    Given un ID inválido de AllergyIntolerance
    When se llama a getById con ese ID
    Then se debe lanzar un error de no encontrado

  Scenario: Falla al obtener AllergyIntolerance inactivo
    Given un ID de AllergyIntolerance inactivo
    When se llama a getById con ese ID
    Then se debe lanzar un error de inactividad
