import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardOdonto = ({ cardsData }) => {
  return (
    <Row className="g-4 justify-content-center">
      {cardsData.map((card, idx) => (
        <Col md={5} lg={4} key={idx} className="d-flex"> 
          <Card
            className="text-white card-hover-effect w-100" 
            style={{ height: "300px", border: "none", overflow: "hidden" }}
          >
            <Card.Img
              src={card.img}
              alt={card.title}
              style={{
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
              }}
            />

            <Card.ImgOverlay className="d-flex flex-column justify-content-end p-3 card-overlay-content">
              {card.link ? (
                
                <Link
                  to={card.link}
                  className="card-button"
                >
                  {card.title}
                </Link>
              ) : (
                
                <Button
                  className="mb-2 card-button"
                  onClick={card.onClick} 
                >
                  {card.title}
                </Button>
              )}
              <Card.Text className="card-description">
                {card.description}
              </Card.Text>
            </Card.ImgOverlay>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardOdonto;