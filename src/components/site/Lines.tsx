import { Fragment } from 'react'

/**
 * A heading written as several lines. The dictionary carries the break as a
 * newline, and this turns each one into a <br />, so the strings stay plain
 * text and the translator never writes markup.
 */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  )
}

/** The same for a list of lines a record already holds as an array. */
export function LineList({ lines }: { lines: readonly string[] }) {
  return <Lines text={lines.join('\n')} />
}
