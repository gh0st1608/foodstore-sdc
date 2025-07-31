Feature: Eliminar un AllergyIntolerance

  Scenario: Elimina un AllergyIntolerance exitosamente
    Given un ID válido de AllergyIntolerance existente
    When ejecuto el método delete
    Then debe retornar un mensaje de éxito con el ID eliminado
    
  Scenario: Error al eliminar un AllergyIntolerance
    Given un ID válido de AllergyIntolerance existente
    When ejecuto el método delete y ocurre un error en la infraestructura
    Then debo recibir una excepción lanzada por la aplicación