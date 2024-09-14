class RawPSQLQueries {
  constructor() {}

  getFilesFormattedSizeWithTimeAgo = () =>
    `WITH time_diff AS (SELECT EXTRACT(epoch FROM NOW() AT TIME ZONE 'utc' - "uploadDate"::timestamp) AS seconds, id FROM "File" WHERE "userId" = ($1) AND "folderId" = ($2))
    SELECT name, "uploadDate", "sizeInKB", "folderId", "userId", "downloadUrl",
      CASE
        WHEN seconds < 60 THEN 'Just now'
        WHEN seconds < 3600 THEN ROUND(seconds / 60) || ' minutes ago'
        WHEN seconds < 86400 THEN ROUND(seconds / 3600) || ' hours ago'
        WHEN seconds < 86400 * 30 THEN ROUND(seconds / 86400) || ' days ago'
        WHEN seconds < 86400 * 30 * 12 THEN ROUND(seconds / (86400 * 30)) || ' months ago'
        ELSE ROUND(seconds / 86400 * 30 * 12) || ' years ago'
      END AS "timeAgo",
      CASE
        WHEN "sizeInKB" < 1000 THEN TRUNC("sizeInKB", 2) || 'KB'
        WHEN "sizeInKB" < 1000000 THEN TRUNC("sizeInKB" / 1000, 2) || 'MB'
        WHEN "sizeInKB" < 1000000000 THEN TRUNC("sizeInKB" / 1000000, 2) || 'GB'
      END AS "formattedSize"
    FROM time_diff INNER JOIN "File" ON "File".id = time_diff.id`;
}

const rawPSQLQueries = new RawPSQLQueries();
export default rawPSQLQueries;
