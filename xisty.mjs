class HTMLElement
{
	constructor(tag)
	{
		this._ = document.createElement(tag.toUpperCase());
		for (let a = 1; a < arguments.length; a++)
		{
			this.append(arguments[a]);
		}
	}

	append(a)
	{
		if (a instanceof HTMLElement)
		{
			// A Element instance (Browser’s DOM object)
			this._.append(a._);
		}
		else if (a instanceof Element || a instanceof String)
		{
			// Object of one of our HTMLElement classes.
			this._.append(a);
		}
		else if ( a instanceof Object )
		{
			// A paramter object. Use keys as attribute names. “class” is
			// a special case.
			for (let key in a)
			{
				const value = a[key];
				if ("key" == "class")
				{
					this.apply_class(value)
				}
				else
				{
					const attr_name = key.replace("_", "-");
					this._.setAttribute(attr_name, value);
				}
			}
		}
		else
		{
			this._.append(a.toString());
		}
	}

	append_to(parent)
	{
		if (parent instanceof Element)
		{
			parent.append(this._);
		}
		else if (parent instanceof HTMLElement)
		{
			parent._.append(this._);
		}
		else
		{
			throw "Type Error: can only append to Element or HTMLElement";
		}
	}
	
	apply_class(value)
	{
		if (value instanceof Array)
		{
			for (let a in value)
			{
				this._.classList.add(a);
			}
		}
		else if (value instanceof String)
		{
			this._.setAttribute("class", value);
		}
	}
}

// From https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// I’ve removed tags marked as depricated (who’d want to use those??) and
// experimantal.
const alltags = "a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script search section select slot small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr".split(" ");

function namespace() {
	for (const tag of alltags)
	{
		this[tag] = function()
		{
			return new HTMLElement(tag, ...arguments)
		};
	}
}

const html = new namespace();

export { html };
