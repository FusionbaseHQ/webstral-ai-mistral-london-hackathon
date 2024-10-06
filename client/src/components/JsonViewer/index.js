import React from 'react'
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

import colors from 'tailwindcss/colors'

export default function JsonViewer({ data, style, theme: jsonTheme }) {

    //Theme for the jsonViewer
    const jsonViewerTheme = {
        base00: colors.slate[800],
        base01: colors.slate[700],
        base02: colors.slate[700],
        base03: colors.slate[200],
        base04: colors.slate[500],
        base05: colors.slate[200],
        base06: colors.slate[200],
        base07: colors.slate[200],
        base08: colors.slate[200],
        base09: colors.emerald[600],
        base0A: colors.slate[100],
        base0B: colors.slate[100],
        base0C: colors.slate[100],
        base0D: colors.slate[100],
        base0E: colors.red[600],
        base0F: colors.sky[600]
    }

    return (
        <ReactJson
            src={data}
            theme={!!jsonTheme ? jsonTheme : jsonViewerTheme}
            style={style} />
    )
}
