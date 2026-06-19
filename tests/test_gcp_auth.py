"""Tests for local vs Cloud Run GCP auth selection."""

from __future__ import annotations

from roboto_guilliman.gcp_auth import optional_local_credentials


def test_optional_local_credentials_on_cloud_run(monkeypatch):
    monkeypatch.setenv("K_SERVICE", "roboto-guilliman")
    assert optional_local_credentials() is None


def test_optional_local_credentials_on_cloud_run_revision_only(monkeypatch):
    monkeypatch.delenv("K_SERVICE", raising=False)
    monkeypatch.setenv("K_REVISION", "roboto-guilliman-00010-abc")
    assert optional_local_credentials() is None
