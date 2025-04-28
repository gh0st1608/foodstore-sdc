Feature: API /patients/:idPerson/address/:idAddress

  Scenario Outline: Se elimina el recurso address
    Given se llama al servicio con <input>
    And se configura el mock con <mock>
    When  se ejecuta la solicitud DELETE al servicio
    Then recibe una respuesta <output>

    Examples:
      | input  | mock   | output |
      | CASE_1 | CASE_1 | CASE_1 |
      | CASE_2 | CASE_2 | CASE_2 |
