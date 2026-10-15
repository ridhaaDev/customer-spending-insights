from datetime import date

from customer_api.repository import MockRepositoryProvider


def test_provider_caches_until_the_date_changes() -> None:
    provider = MockRepositoryProvider(seed=1, today_override=date(2024, 9, 16))
    repo_a, today_a = provider.current()
    repo_b, _ = provider.current()
    assert repo_a is repo_b
    assert today_a == date(2024, 9, 16)

    provider._today_override = date(2024, 9, 17)  # simulate midnight passing
    repo_c, today_c = provider.current()
    assert repo_c is not repo_a
    assert today_c == date(2024, 9, 17)
    # The regenerated history extends up to (never past) the new date.
    latest = repo_c.transactions_for("10001")[0]
    assert latest.occurred_on <= date(2024, 9, 17)


def test_provider_is_deterministic_for_seed_and_date() -> None:
    a, _ = MockRepositoryProvider(seed=7, today_override=date(2024, 1, 31)).current()
    b, _ = MockRepositoryProvider(seed=7, today_override=date(2024, 1, 31)).current()
    assert [t.id for t in a.transactions_for("10003")[:50]] == [t.id for t in b.transactions_for("10003")[:50]]
    assert [t.amount_cents for t in a.transactions_for("10003")[:50]] == [
        t.amount_cents for t in b.transactions_for("10003")[:50]
    ]
