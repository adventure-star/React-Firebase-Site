import http from "./httpService";
const url = http.baseUrl + "/api/accounts";

export function test() {
  return http.get(url + '/test', {headers: {'Authorization':"Bearer " + localStorage.getItem('token')}});
}
export function updateAccount(user) {
  const body = { ...user }
  return http.post(url + '/updateAccount', body,  {headers: {'Authorization':"Bearer " + localStorage.getItem('token')}});

}
