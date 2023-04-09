import Pokemon from "./pokemon";
import { Col, Container, Row, Card, Button} from "react-bootstrap";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiGetSinglePokemon } from "../api/pokeAPI";
import "../styles/pokemonComponent.css";

function PokemonPage({ currentPokemon, currentPage }) {

    const [ individualPoke, setIndividualPoke ] = useState("");

    const getMoreInfo = async (pokeID) => {
        apiGetSinglePokemon(pokeID)
        .then(res => res.data)
        .then(res => {
          setIndividualPoke(res);
        })
        .catch(err => console.log(err));
        renderMoreInfo(individualPoke[0]);
    };

    const formatExtraInformation = (singlePoke) => {
        return(
            <>
            <Card.Text>Type: {singlePoke.type.map(item => ' ' + item)} </Card.Text>
            <Card.Text>Base Stats: </Card.Text>
            <Card.Text>HP: {singlePoke.base.HP} </Card.Text>
            <Card.Text>Attack: {singlePoke.base.Attack} </Card.Text>
            <Card.Text>Defence: {singlePoke.base.Defense} </Card.Text>
            </>
        );
    };

    const renderMoreInfo = (singlePoke) => {
        return(
            <Card.Body className="more-info-card-body"> 
                <Card.Title style={ { textAlign: 'center' } }> { singlePoke.name.english } </Card.Title>
                {formatExtraInformation(singlePoke)}
                <div style={ {textAlign: 'center'}}> 
                    <Button 
                        variant="secondary"
                        size="sm"
                        className="learn-more-button"
                        onClick={() => setIndividualPoke("")}
                    > 
                        Minimize 
                    </Button>
                </div>
            </Card.Body>
        );
    };

    const renderBasicCard = ( item ) => {
        return(
          <Card.Body className="basic-card-body"> 
            <Card.Title style={ { textAlign: 'center', paddingBottom: '10px', color: 'green' } }> { item.name.english } </Card.Title>
            <Pokemon key = { item.id } pokemon= { item } />
            <div style={ {textAlign: 'center', paddingTop: '20px'} }> 
              <Button 
                variant="success"
                size="sm"
                onClick={() => getMoreInfo(item.id)}
              > 
                Learn More 
              </Button>
            </div>
          </Card.Body>
        )
      };
      

    return(
        <div> 

        <h1 className="heading-card">Page {currentPage}</h1>

        <Container>        
        <Row xs={2} md={5}>
        {currentPokemon.map(item => (
                <Col>
                    <Card>
                        { individualPoke && individualPoke[0].id === item.id ? renderMoreInfo(item) : renderBasicCard(item)}

                    </Card>
                </Col>
            ))}
        </Row>
    </Container>

    </div>
    );
};

export default PokemonPage;
