PANDOC = pandoc 
PANDOC_OPTS = -f markdown+yaml_metadata_block+definition_lists+multiline_tables
MDS = $(wildcard *.md)
PDFS = $(MDS:.md=.pdf)

all: $(PDFS)

%.pdf: %.md
	$(PANDOC) $(PANDOC_OPTS) $< -o $@ 

.PHONY: clean

clean:
	find . -name "*.pdf" -delete

