let table = document.createElement("table");
table.classList.add("my-table");
table.innerHTML = `
<tr>
  <th>Profile Image</th>
  <th>Name</th>
  <th>Company</th>
  <th>Email</th>
  <th>Followers</th>
  <th>Following</th>
  <th>Total Public Repositories</th>
</tr>
`;
let previousInput = "";
let parent = document.getElementById("results");
function get() {
  let img;
  let comp;
  let email;
  let followers;
  let following;
  let publicRepo = 0;
  let input = document.getElementById("input").value;
  let name;
  previousInput = input;
  const api = "https://api.github.com/";
  let apilink = api + "users/" + input;
  if (nameExistsInTable(input)) {
    return;
  }

  fetch(apilink)
    .then((response) => response.json())
    .then((data) => {
      img = data.avatar_url;
      comp = data.company;
      email = data.email;
      followers = data.followers;
      following = data.following;
      name = data.login;
      //   console.log(data.login);
      return fetch(data.repos_url);
    })
    .then((reposResponse) => reposResponse.json())
    .then((reposData) => {
      //   console.log(reposData);

      for (let i = 0; i < reposData.length; i++) {
        if (!reposData[i].private) {
          publicRepo++;
        }
      }
      table.innerHTML += `
          <tr>
            <td>${img ? `<img width="100px" src="${img}">` : ""}</td>
            <td>${name}</td>
            <td>${comp}</td>
            <td>${email}</td>
            <td>${followers}</td>
            <td>${following}</td>
            <td> ${publicRepo}</td>
          </tr>
        `;
      parent.append(table);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  function nameExistsInTable(name) {
    const rows = table.querySelectorAll("tr td:nth-child(2)");
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].textContent.trim() === name.trim()) {
        let rows1 = table.querySelectorAll("tr");
        let newdata = rows1[i + 1].innerHTML;
        console.log(newdata);
        table.deleteRow(i + 1);
        table.innerHTML += newdata;
        return 1;
      }
    }
    return 0;
  }
}
