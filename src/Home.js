import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import io from "socket.io-client";
import { Link } from "react-router-dom";

const Home = () => {
  const [course, setCourse] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const url = "http://localhost:2556";

  const fetchData = async () => {
    const res = await axios.get(url);
    if (res) {
      setDisplayData(res.data.data);
      console.log(res.data.data);
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    const file = { course };
    await axios.post(url, file);
    setCourse("");
  };

  const removePost = async (id) => {
    await axios.delete(`${url}/${id}`);
  };

  const socket = io(url);

  socket.on("observer", (data) => {
    console.log(data);
    if (data) {
      setDisplayData([...displayData, data]);
    } else {
      fetchData();
    }
  });

  socket.on("deleteObserver", (data) => {
    console.log(data);
    if (data) {
      // const { _id } = data;
      const removeData = displayData.filter((el) => el.id !== data);
      setDisplayData(removeData);
    } else {
      fetchData();
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Container>
        <Wrapper>
          <InputHolder onSubmit={submitPost}>
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
            {displayData?.map(({ _id, course }) => (
              <Card key={_id}>
                <Course>{course}</Course>
                <div>
                  <Button1 to={`/${_id}`}>Edit</Button1>
                  <Button
                    onClick={() => {
                      removePost(_id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </Holder>
        </Wrapper>
      </Container>
    </div>
  );
};

export default Home;

const Button1 = styled(Link)`
  text-decoration: none;
  padding: 15px 20px;
  margin-left: 10px;
  background: #004080;
  color: white;
  border-radius: 3px;
  outline: none;
  border: 0;
  transition: all 350ms;
  transform: scale(1);
  margin-top: 10px;

  :hover {
    transform: scale(0.97);
    cursor: pointer;
  }
`;

const Button = styled.button`
  padding: 15px 20px;
  margin-left: 10px;
  background: #004080;
  color: white;
  border-radius: 3px;
  outline: none;
  border: 0;
  transition: all 350ms;
  transform: scale(1);
  margin-top: 10px;

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
