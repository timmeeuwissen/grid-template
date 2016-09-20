#!/bin/bash

# $1 = directory to scan for documents
# $2 = directory to put finished css documents in

find $1 -name [^_]*.scss 2> /dev/null | while read input
do
    output=$(echo $input | sed s@^$1@$2@ | sed s@\.scss$\@\.css@)

    outputdir=${output%/*}
    mkdir -p $outputdir

    sass -t compressed $input ${output}
done
