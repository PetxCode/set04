import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();
  const naviagte = useNavigate();
  const [course, setCourse] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const url = "http://localhost:2556";

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:2556/${id}`);
    if (res) {
      setDisplayData(res.data.data);
      console.log(res.data);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    const file = { course };
    await axios.patch(`${url}/${id}`, file);
    setCourse("");
    naviagte("/");
  };

  const socket = io(url);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Container>
        {id}
        <Wrapper>
          <InputHolder
            onSubmit={() => {
              updatePost(id);
            }}
          >
            <Input
              placeholder="Enter a Course"
              value={course}
              onChange={({ target }) => {
                setCourse(target.value);
              }}
            />
            <Button type="submit">Add to List</Button>
          </InputHolder>

          <Holder>
            <Card>
              <Course>{displayData.course}</Course>
            </Card>
          </Holder>
        </Wrapper>
      </Container>
    </div>
  );
};

export default Detail;

const Button = styled.button`
  padding: 15px 30px;
  margin-left: 10px;
  background: #004080;
  color: white;
  border-radius: 3px;
  outline: none;
  border: 0;
  transition: all 350ms;
  transform: scale(1);

  :hover {
    transform: scale(0.97);
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 250px;
  height: 40px;
  outline: none;
  border: 1px solid silver;
  border-radius: 2px;
  padding-left: 10px;
`;

const InputHolder = styled.form`
  margin-bottom: 50px;
  display: flex;
  align-items: center;
`;

const Course = styled.div`
  font-weight: bold;
`;

const Card = styled.div`
  margin: 10px;
  width: 200px;
  min-height: 100px;
  background: white;
  border-radius: 5px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding-top: 20px;
  justify-content: center;
`;

const Holder = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: lightgray;
`;
