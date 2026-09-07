"""Initial VitalAI schema.

Revision ID: 0001_initial
Revises:
Create Date: 2026-08-29
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("uuid", postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("uuid"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "health_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("gender", sa.String(length=32), nullable=False),
        sa.Column("height_cm", sa.Float(), nullable=False),
        sa.Column("weight_kg", sa.Float(), nullable=False),
        sa.Column("daily_steps", sa.Integer(), nullable=False),
        sa.Column("exercise_frequency", sa.Integer(), nullable=False),
        sa.Column("exercise_minutes", sa.Integer(), nullable=False, server_default="25"),
        sa.Column("sleep_hours", sa.Float(), nullable=False),
        sa.Column("water_intake_liters", sa.Float(), nullable=False),
        sa.Column("smoking", sa.String(length=32), nullable=False),
        sa.Column("alcohol_consumption", sa.String(length=32), nullable=False),
        sa.Column("systolic_bp", sa.Integer(), nullable=False),
        sa.Column("diastolic_bp", sa.Integer(), nullable=False),
        sa.Column("resting_heart_rate", sa.Integer(), nullable=False),
        sa.Column("family_history", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("existing_conditions", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("fruit_vegetable_intake", sa.Integer(), nullable=False),
        sa.Column("processed_food_frequency", sa.String(length=32), nullable=False),
        sa.Column("sugar_intake", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("user_id", name="uq_health_profiles_user_id"),
    )
    op.create_index("ix_health_profiles_user_id", "health_profiles", ["user_id"])

    op.create_table(
        "health_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("record_date", sa.Date(), nullable=False),
        sa.Column("weight_kg", sa.Float(), nullable=False),
        sa.Column("steps", sa.Integer(), nullable=False),
        sa.Column("sleep_hours", sa.Float(), nullable=False),
        sa.Column("exercise_minutes", sa.Integer(), nullable=False),
        sa.Column("water_intake_liters", sa.Float(), nullable=False),
        sa.Column("health_score", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_health_records_user_id", "health_records", ["user_id"])
    op.create_index("ix_health_records_record_date", "health_records", ["record_date"])

    op.create_table(
        "risk_assessments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("overall_risk", sa.Float(), nullable=False),
        sa.Column("cardiovascular_risk", sa.Float(), nullable=False),
        sa.Column("diabetes_risk", sa.Float(), nullable=False),
        sa.Column("hypertension_risk", sa.Float(), nullable=False),
        sa.Column("lifestyle_risk", sa.Float(), nullable=False),
        sa.Column("risk_level", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_risk_assessments_user_id", "risk_assessments", ["user_id"])

    op.create_table(
        "prevention_plans",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("target", sa.String(length=120), nullable=False),
        sa.Column("progress", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_prevention_plans_user_id", "prevention_plans", ["user_id"])


def downgrade() -> None:
    op.drop_table("prevention_plans")
    op.drop_table("risk_assessments")
    op.drop_table("health_records")
    op.drop_table("health_profiles")
    op.drop_table("users")
