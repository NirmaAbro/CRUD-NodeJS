const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 3000;

// middleware use kr rhy hn for getting data into frontend
//ya ya kam kryga jab bhi data fomr sa ayga ya usy body ma dalny k kam kryga just like that
//basically har request p ya plugin chlta ha
app.use(express.urlencoded({ extended: false }));

// Route to get all users
app.get("/users", (req, res) => {
  return res.json(users);
});

// Route to get a user by id
app
  .get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    console.log(`Requested user ID: ${id}`); // Debugging output
    const user = users.find((u) => u.id === id);
    console.log(`Found user: ${JSON.stringify(user)}`); // Debugging output
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    console.log(`Updating user with ID ${id}. New data:`, body);

    // Find the index of the user with the given id
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      // Update the user
      users[userIndex] = {
        ...users[userIndex],
        ...body,
      };

      // Write updated users array to MOCK_DATA.json asynchronously
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).json({ error: "Failed to update user data." });
        }
        console.log("Data written to file successfully.");
        return res.json({ status: "success", updatedUser: users[userIndex] });
      });
    } else {
      return res.status(404).json({ error: `User with ID ${id} not found.` });
    }
  })
  .delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    // Find the index of the user with the given ID
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      // Delete the user from the array
      users.splice(userIndex, 1);

      // Write updated users array to MOCK_DATA.json asynchronously
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).json({ error: "Failed to delete user." });
        }
        console.log(`User with ID ${id} deleted successfully.`);
        return res.json({ status: "success", deletedUserId: id });
      });
    } else {
      return res.status(404).json({ error: `User with ID ${id} not found.` });
    }
  });

//create user by
app.post("/api/users", (req, res) => {
  const body = req.body;
  // console.log("body in post req ",body);  fo rchecking purpose , k body m data milbhi rha ha k nhi

  // Add new user to the users array
  const newUser = {
    id: users.length + 1,
    ...body,
  };
  users.push(newUser);

  //esmy body ma append krny k lia hmny fs module import kia

  //ab yaha masla ya tha k id frontend sa nhi ati then , eslia uper hmny body ko spread operator sa spread kia , r user ki length ma add 1 krdea jis sa jitny bhi users hongy usmy add 1 hojayga

  // Write updated users array to MOCK_DATA.json
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).json({ error: "Failed to save user data." });
    }
    console.log("Data written to file successfully.");
    return res.json({ status: "success", newUser, id: users.length + 1 });
  });
});

app.listen(PORT, () => {
  console.log(`app is running on the port: ${PORT}`);
});
