import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function TypeBox({ currentFilters, setFilters }) {
  const [pokeTypes, setPokeTypes] = useState([]);

  const url = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json';

  useEffect(() => {
    fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((processedResp) => {
        setPokeTypes(processedResp);
      })
      .catch((err) => console.log('error:', err));
  }, []);

  const addToFilter = (typeName) => {
    const checkbox = document.getElementById(typeName);

    if (checkbox.checked) {
      setFilters([...currentFilters, typeName]);
    } else {
      setFilters(currentFilters.filter((elem) => elem !== typeName));
    }
  };

  return (
    <div>
      <Container>
        <Row xs={3} md={6}>
          {pokeTypes.map((item) => {
            return (
              <Col key={item.english}>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    value={item.english}
                    id={item.english}
                    name="pokeTypes"
                    onChange={() => addToFilter(item.english)}
                  />
                  <label className="checkbox-label" htmlFor={item.english}>
                    {item.english}
                  </label>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default TypeBox;
