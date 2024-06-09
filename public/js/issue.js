const fetchUsers = async () => {
  const resp = await fetch("/static/users.json");
  return await resp.json();
}