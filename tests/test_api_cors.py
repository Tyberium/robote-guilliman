from unittest.mock import MagicMock

from fastapi.testclient import TestClient
from google.genai.errors import ClientError

from roboto_guilliman.api.main import app


def test_ask_preflight_includes_cors_headers():
    client = TestClient(app)
    response = client.options(
        "/v1/ask",
        headers={
            "Origin": "http://localhost:5174",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "*"


def test_vertex_error_returns_json_with_cors_headers():
    state = MagicMock()
    vertex_response = MagicMock()
    vertex_response.body_segments = [{"error": {"message": "denied", "status": "PERMISSION_DENIED"}}]
    state.retriever.retrieve.side_effect = ClientError(403, vertex_response)
    app.state.ro_boto = state

    client = TestClient(app)
    response = client.post(
        "/v1/ask",
        json={"query": "What does TWIN-LINKED do?", "use_cache": False},
        headers={"Origin": "http://localhost:5174"},
    )

    assert response.status_code == 503
    assert "Vertex AI" in response.json()["detail"]
    assert response.headers.get("access-control-allow-origin") == "*"
