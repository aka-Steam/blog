import http from 'k6/http';
export default function () {
  http.get('http://158.160.178.118/api/posts');
}