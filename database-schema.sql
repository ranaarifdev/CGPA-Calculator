-- Backend-ready curriculum schema (SQLite-compatible).
-- The current app is static; this schema defines the persistence boundary for a future API.

CREATE TABLE programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    short_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'coming-soon'
        CHECK (status IN ('available', 'coming-soon'))
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    credit_hours REAL NOT NULL CHECK (credit_hours > 0),
    credit_display TEXT NOT NULL
);

CREATE TABLE program_courses (
    program_id TEXT NOT NULL,
    course_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (program_id, course_id),
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_program_courses_program
    ON program_courses(program_id, display_order);

INSERT INTO programs (id, name, short_name, status) VALUES
    ('cyber-security', 'BS Cyber Security', 'Cyber Security', 'available'),
    ('artificial-intelligence', 'BS Artificial Intelligence', 'Artificial Intelligence', 'coming-soon'),
    ('computer-science', 'BS Computer Science', 'Computer Science', 'coming-soon'),
    ('software-engineering', 'BS Software Engineering', 'Software Engineering', 'coming-soon'),
    ('information-technology', 'BS Information Technology', 'Information Technology', 'coming-soon'),
    ('data-science', 'BS Data Science', 'Data Science', 'coming-soon');
