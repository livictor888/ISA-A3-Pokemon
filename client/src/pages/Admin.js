import { Col, Container, Row, Card, Button } from "react-bootstrap";
import ErrorEndpoints from "../components/errorsByEndpoint";
import RecentErrors from "../components/recentErrors";
import TopUsers from "../components/topUsers";
import UniqueUsers from "../components/uniqueUsers";
import Endpoints from "../components/usersByEndpoint";
import withAdminAuth from "../components/withAdminAuth";
import { apiLogout } from "../api/pokeAPI";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/")}
          className="pokedex-button"
        >
          Back to Pokedex
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={async () => {
            await apiLogout();
            navigate("/login");
          }}
          className="logout-button"
        >
          Logout
        </Button>
      </div>
      <h1 style={{ textAlign: "center", textShadow: "2px 2px black"  }}>Admin Panel</h1>
      <Container>
        <Row xs={1} sm={3}>
          <Col>
            <Card>
              <Card.Title style={{ textAlign: "center" }}>
                Number of Errors by Endpoint
              </Card.Title>
              <ErrorEndpoints />
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Title style={{ textAlign: "center" }}>
                Top API Users
              </Card.Title>
              <TopUsers />
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Title style={{ textAlign: "center" }}>
                Unique Users Over the Last Two Days
              </Card.Title>
              <UniqueUsers />
            </Card>
          </Col>
        </Row>
        <Row xs={1}>
          <Col>
            <Card>
              <Card.Title style={{ textAlign: "center" }}>
                Recent 4xx Errors
              </Card.Title>
              <RecentErrors />
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Title style={{ textAlign: "center" }}>
                Top User of Each Endpoint
              </Card.Title>
              <Endpoints />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default withAdminAuth(AdminPage);

